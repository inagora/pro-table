const download = (columns, records = []) => {
  // 使用exceljs导出
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();
  workbook.modified = new Date();
  const sheet = workbook.addWorksheet("default");
  sheet.properties.defaultRowHeight = 25;
  let _columns = [];
  columns.forEach((column) => {
    if ((column.dataIndex || column.title) && column.dataIndex !== "action") {
      _columns.push({
        header: column.title || column.dataIndex,
        key: column.dataIndex,
      });
    }
  });
  sheet.columns = _columns;
  let data = records;
  sheet.addRows(data);
  // columns.forEach((column) => {
  //   const col = sheet.getColumn(column.dataIndex);
  //   col.eachCell((cell, rowNumber) => {
  //     if (column.bgColor) {
  //       cell.fill = {
  //         type: "gradient",
  //         gradient: "angle",
  //         degree: 0,
  //         stops: [{ position: 0, color: { argb: column.bgColor } }],
  //       };
  //       cell.alignment = {
  //         wrapText: true,
  //       };
  //       cell.border = {
  //         top: { style: "thin" },
  //         left: { style: "thin" },
  //         bottom: { style: "thin" },
  //         right: { style: "thin" },
  //       };
  //       if (rowNumber === 1) {
  //         cell.alignment = {
  //           vertical: "middle",
  //           horizontal: "center",
  //           wrapText: true,
  //         };
  //       }
  //     }
  //   });
  // });
  const file = Date.now() + ".xlsx";

  workbook.xlsx.writeBuffer(file).then(function (value) {
    const blob = new Blob([value], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", file);

    document.body.appendChild(link);
    link.click();
    //释放URL对象所占资源
    window.URL.revokeObjectURL(url);
    //用完即删
    document.body.removeChild(link);
  });
};
export default download;
