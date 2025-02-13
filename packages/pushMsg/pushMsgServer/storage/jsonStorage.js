// storage/jsonStorage.js
const fs = require("fs");
const path = require("path");
const config = require("../config");

function readData(date) {
  const fileData = fs.existsSync(config.jsonFilePath)
    ? JSON.parse(fs.readFileSync(config.jsonFilePath))
    : [];

  // 过滤出当天的数据
  const filteredData = fileData.filter((item) => {
    const createdAt = new Date(item.created_at);
    const itemDate = createdAt.toISOString().split("T")[0];
    return itemDate === date; // 只返回当天的数据
  });

  return filteredData;
}

function writeData(data) {
  fs.writeFileSync(config.jsonFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData
};
