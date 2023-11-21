import * as XLSX from 'xlsx';


export function exportExcel(sheetNames,jsonData){
    let jsonWorkSheet = XLSX.utils.json_to_sheet(jsonData,{skipHeader: true});
    autoWidth(jsonWorkSheet)
    
    // 构造workBook
    let workBook = {
      SheetNames:['sheet1'],
      Sheets: {
        ['sheet1']: jsonWorkSheet,
      }
    };
    // 将workBook写入文件
    const result = XLSX.writeFile(workBook, `./${sheetNames}.xlsx`);

    return result
}

function autoWidth(worksheet) {
  let maxWidth = {};
  console.log(worksheet)
  for (let cell in worksheet) {
      if(cell[0] === '!') continue;
      let col = cell.substring(0,1); // get the column (assuming a maximum of 26 columns)
      let value = worksheet[cell].v; // get cell value
      maxWidth[col] = Math.max(maxWidth[col] || 0, typeof value === 'string' ? value.length : (value.toString()).length);
  }

  worksheet['!cols'] = Object.keys(maxWidth).map(col => ({wch: maxWidth[col] + 10}));
}