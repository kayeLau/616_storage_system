import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style-medalsoft'
import JSZip from 'jszip';
import { classifyDict , departmentDict , freezersNumDict , productDisable , productSummary , exchangeKeyValue } from '../request/dict'

export function xlsxToJson(fileBinaryString) {
  const workBook = XLSX.read(fileBinaryString, { type: 'binary' })
  const _classifyDict = exchangeKeyValue(classifyDict)
  const _departmentDict = exchangeKeyValue(departmentDict)
  const _freezersNumDict = exchangeKeyValue(freezersNumDict)
  const _productDisable = exchangeKeyValue(productDisable)
  const _productSummary = exchangeKeyValue(productSummary)
  let result = [] 

  workBook.SheetNames.forEach(sheetName => {
    const jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {});
    console.log(jsonData)
    result = jsonData.map(item => {
      return {
        productId:item.productId,
        productCode:item.productCode,
        department:_departmentDict[item.department],
        freezersNum:Number(_freezersNumDict[item.freezersNum]),
        classify:Number(_classifyDict[item.classify]),
        productName:item.productName,
        unit:item.unit,
        standard:item.standard,
        disable:Number(_productDisable[item.disable]),
        summary:Number(_productSummary[item.summary]),
        prompt:0,
      }
    })
  })
  
  console.log(result)
  let fileData = new Blob([JSON.stringify(result)], { type: 'application/json' })
  FileSaver.saveAs(fileData,'db.json')
}

export function exportExcel({exportDate, usezip = false, zipFileName, hpt , header }) {
  let zip = new JSZip();
  exportDate.forEach(item => {
    let jsonWorkSheet = XLSX.utils.json_to_sheet(item.jsonData, { skipHeader: true });
    autoWidth(jsonWorkSheet)
    if (hpt) {
      let height = new Array(99).fill(0).map(() => { return { hpt } })
      jsonWorkSheet['!rows'] = height
    }

    for (let cell in jsonWorkSheet) {
      if (cell[0] === '!') continue;
      let isBold = false;
      if(header){
        let currentRow = cell.match(/\d+/) === null ? '-1' : cell.match(/\d+/)[0];
        isBold = currentRow === String(header) ? true : false;
      }
      jsonWorkSheet[cell].s = {
        font: {
          name: "Calibri",
          sz: 14,
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
    console.log(jsonWorkSheet)

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

function autoWidth(worksheet) {
  let maxWidth = {};
  for (let cell in worksheet) {
    if (cell[0] === '!') continue;
    let col = cell.substring(0, 1); // get the column (assuming a maximum of 26 columns)
    let value = worksheet[cell].v; // get cell value
    if (value) {
      maxWidth[col] = Math.max(maxWidth[col] || 0, typeof value === 'string' ? value.length : (value.toString()).length);
    }
  }

  worksheet['!cols'] = Object.keys(maxWidth).map(col => ({ wch: maxWidth[col] * 2.2 }));
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff
  }
  return buf
}