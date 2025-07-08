import { ElMessage } from 'element-plus'
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import XLSXStyle from 'xlsx-style-medalsoft';
import JSZip from 'jszip';
import { getStorge } from '../utils/auth';
import { exportDailyMeetSummary, readOrderDetail, readOrderDatailSummary } from '../request/orders';
import { classifyDict, departmentDict, freezersNumDict, disable, productSummary, exchangeKeyValue } from '../request/dict';
import { formatterDate } from '../utils/tools'

// 導出鮮肉類總表
export function exportMeatSummary(exportDate) {
  exportDailyMeetSummary({ exportDate, exportType: 1 }).then(res => {
    if (res.success && res.data.shopName.length) {
      const exportDateStr = formatterDate(new Date(exportDate))
      let shopName = res.data.shopName
      let products = res.data.products
      let jsonData = products.map((product) => {
        let summary = product.orderItems.reduce((prev, acc) => prev + acc) + product.unit
        // 各分店下單產品數量
        let row = shopName.map((item, columnIndex) => {
          let order = product.orderItems[columnIndex]
          return order + product.unit
        })
        return [product.productName, ...row, product.productName, summary]
      })
      jsonData.unshift(['產品名稱', ...shopName, '產品名稱', '出貨總數'])

      const dailyMeetSummary = {
        sheetNames: exportDateStr + '工埸鮮肉匯總表',
        jsonData
      }
      exportExcel({ exportDate: [dailyMeetSummary], usezip: false, zipFileName: '', hpt: 40, wpt: 3, header: '1' })
    } else {
      ElMessage({ type: 'error', message: '沒有可導出的數據' })
    }
  })
}

// 導出總表(非鮮肉類)
export function exportAllSummary(exportDate) {
  let user = getStorge('userInfo')
  let userInfo = user ? JSON.parse(user) : {}
  exportDailyMeetSummary({ exportDate, exportType: 0 }).then(res => {
    if (res.success && res.data.shopName.length) {
      const exportDateStr = formatterDate(new Date(exportDate))
      let products = res.data.products
      if (userInfo.auth === 3) {
        products = products.filter(item => item.freezersNum === 1 || item.freezersNum === 3 || item.freezersNum === 4)
      }
      let jsonData = []
      let rowIndex = 0
      let jindex = 0
      // 產品
      products.map((product) => {
        let summary = product.orderItems.reduce((prev, acc) => prev + acc)
        if (summary > 0) {
          let freezersNum = freezersNumDict[product.freezersNum]
          if (rowIndex % 2 === 1) {
            jsonData[jindex] = [...jsonData[jindex], ' ', product.productName, freezersNum, summary, product.unit]
            jindex++
          } else {
            jsonData[jindex] = [product.productName, freezersNum, summary, product.unit]
          }
          rowIndex++
        }
      })
      const header = rowIndex > 0 ? ['產品名稱', '雪房編號', '出貨數量', '單位', ' ', '產品名稱', '雪房編號', '出貨數量', '單位'] : ['產品名稱', '雪房編號', '出貨數量', '單位']
      jsonData.unshift(header)

      const dailyMeetSummary = {
        sheetNames: exportDateStr + '出貨匯總表',
        jsonData
      }
      exportExcel({ exportDate: [dailyMeetSummary], header: '1', hpt: 30, wpt: 2.5 })
    } else {
      ElMessage({ type: 'error', message: '沒有可導出的數據' })
    }
  })
}

// 導出分店送貨單匯總
export async function exportOrderExcel(index, row) {
  const date = new Date(row.createDate)
  const exportDateStr = formatterDate(new Date(date)) + '_'
  const exportDateStrF = formatterDate(new Date(date), '/')
  let children = []
  await readOrderDetail({ orderId: row.id }).then(res => {
    if (res.success) {
      children = res.data
    }
  })
  const shipping = {
    sheetNames: exportDateStr + row.shopName + '出貨表',
    jsonData: [
      [row.shopCode, row.shopName, '', exportDateStrF],
      ['貨品編號', '貨品名稱', '數量/重量', '單位', '包裝規格'],
      ...children.map(item => [
        item.productCode,
        item.productName,
        item.assignQuantity,
        item.unit,
        item.standard,
      ])
    ]
  };

  const delivery = {
    sheetNames: exportDateStr + row.shopName + '送貨單',
    jsonData: [
      [row.shopName, row.orderUserName[0], '', '', '', row.updateDate],
      ['貨品名稱', '分配數量', '單位', '下單數量', '包裝規格', '備注'],
      ...children.map(item => [
        item.productName,
        item.assignQuantity,
        item.unit,
        item.orderQuantity,
        item.standard,
        item.remark
      ])
    ]
  }
  exportExcel({ exportDate: [shipping, delivery], usezip: true, zipFileName: String(exportDateStr + row.shopName), header: '2', wpt: 3 })
}

// 導出指定時間段分店下單匯總
export async function exportOrderDatailSummary(params) {
  const startDate = new Date(params.updateDate[0])
  const endDate = new Date(params.updateDate[1])
  const exportDateStr = formatterDate(new Date(startDate)) + '-' + formatterDate(new Date(endDate)) + '_'
  let result = []
  await readOrderDatailSummary({ ...params }).then(res => {
    if (res.success) {
      result = res.data
    }
  })
  const shipping = {
    sheetNames: exportDateStr + params.shopName + '匯總表',
    jsonData: [
      ['產品編號', '產品名稱', '下單數量', '分配數量', '規格'],
      ...result.map(item => [
        item.productCode,
        item.productName,
        item.orderQuantity,
        item.assignQuantity,
        item.standard,
      ])
    ]
  };

  exportExcel({ exportDate: [shipping], usezip: false, header: '2', wpt: 3 })
}

/* ========================= base ========================= */
export function xlsxToJson(fileBinaryString) {
  const workBook = XLSX.read(fileBinaryString, { type: 'binary' })
  const _classifyDict = exchangeKeyValue(classifyDict)
  const _departmentDict = exchangeKeyValue(departmentDict)
  const _freezersNumDict = exchangeKeyValue(freezersNumDict)
  const _disable = exchangeKeyValue(disable)
  const _productSummary = exchangeKeyValue(productSummary)
  let result = []

  workBook.SheetNames.forEach(sheetName => {
    const jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {});
    console.log(jsonData)
    result = jsonData.map(item => {
      return {
        productId: item.productId,
        productCode: item.productCode,
        department: _departmentDict[item.department],
        freezersNum: Number(_freezersNumDict[item.freezersNum]),
        classify: Number(_classifyDict[item.classify]),
        productName: item.productName,
        unit: item.unit,
        standard: item.standard,
        disable: Number(_disable[item.disable]),
        summary: Number(_productSummary[item.summary]),
        prompt: 0,
      }
    })
  })

  let fileData = new Blob([JSON.stringify(result)], { type: 'application/json' })
  FileSaver.saveAs(fileData, 'db.json')
}

export function exportExcel({ exportDate, usezip = false, zipFileName, hpt, header, wpt }) {
  let zip = new JSZip();
  exportDate.forEach(item => {
    let jsonWorkSheet = XLSX.utils.json_to_sheet(item.jsonData, { skipHeader: true });
    autoWidth(jsonWorkSheet, wpt)
    if (hpt) {
      let height = new Array(99).fill(0).map(() => { return { hpt } })
      jsonWorkSheet['!rows'] = height
    }

    for (let cell in jsonWorkSheet) {
      if (cell[0] === '!') continue;
      let isBold = false;
      if (header) {
        let currentRow = cell.match(/\d+/) === null ? '-1' : cell.match(/\d+/)[0];
        isBold = currentRow === String(header) ? true : false;
      }
      jsonWorkSheet[cell].s = {
        font: {
          name: "Calibri",
          sz: 16,
          bold: isBold,
        },
        alignment: {
          horizontal: "center",
          vertical: "center"
        },
        border: {
          top: { style: "thin", color: { rgb: "00000000" } },
          bottom: { style: "thin", color: { rgb: "00000000" } },
          left: { style: "thin", color: { rgb: "00000000" } },
          right: { style: "thin", color: { rgb: "00000000" } }
        }
      }
    }
    // console.log(jsonWorkSheet)

    // 构造workBook
    let workBook = {
      SheetNames: ['sheet1'],
      Sheets: {
        ['sheet1']: jsonWorkSheet,
      }
    };

    // 将workBook写入文件
    let result = XLSXStyle.write(workBook, {
      bookType: 'xlsx',
      type: 'binary'
    })
    let fileData = new Blob([s2ab(result)], { type: 'application/octet-stream' })
    if (usezip) {
      zip.file(`${item.sheetNames}.xlsx`, fileData, { binary: true });
    } else {
      FileSaver.saveAs(fileData, `${item.sheetNames}.xlsx`);
    }
  });
  if (usezip) {
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      FileSaver.saveAs(blob, `${zipFileName}.zip`);
    });
  }
}

function autoWidth(worksheet, wpt = 2.2) {
  let maxWidth = {};
  for (let cell in worksheet) {
    if (cell[0] === '!') continue;
    let col = cell.substring(0, 1); // get the column (assuming a maximum of 26 columns)
    let value = worksheet[cell].v; // get cell value
    if (value) {
      // console.log(col,worksheet[cell].v)
      maxWidth[col] = Math.max(maxWidth[col] || 0, typeof value === 'string' ? value.length : (value.toString()).length);
      if (col === 'C') {
        console.log(maxWidth[col])
        // console.log(worksheet[cell].v)
      }
    }
  }
  worksheet['!cols'] = Object.keys(maxWidth).sort().map(col => ({ wch: maxWidth[col] * wpt }));
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff
  }
  return buf
}