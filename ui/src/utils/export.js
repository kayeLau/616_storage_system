import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style-medalsoft'
import JSZip from 'jszip';


export function exportExcel(exportDate, usezip = false, zipFileName , hpt ) {
  let zip = new JSZip();
  exportDate.forEach(item => {
    let jsonWorkSheet = XLSX.utils.json_to_sheet(item.jsonData, { skipHeader: true });
    autoWidth(jsonWorkSheet)
    if(hpt){
      let height = new Array(99).fill(0).map(() => { return { hpt } })
      console.log(height)
      jsonWorkSheet['!rows'] = height
    }

    for (let cell in jsonWorkSheet) {
      if (cell[0] === '!') continue;
      let isBold = cell[1] === '2' ? true : false;
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
    maxWidth[col] = Math.max(maxWidth[col] || 0, typeof value === 'string' ? value.length : (value.toString()).length);
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