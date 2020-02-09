module.exports = {
  handleData(result, defaultDate) {
    // console.log(result,defaultDate)
    let res = [];
    // console.log(result)
    for (let item of Object.entries(result)) {
      let { name, en_name } = getTextName(defaultDate, item);
      if (name) {
        let data = JSON.parse(item[1]);
        let cities = [];
        if (data.cities.length < 1) {
          cities.push({
            cityName: data.provinceShortName,
            confirmedCount: data.confirmedCount,
            curedCount: data.curedCount,
            deadCount: data.deadCount,
            locationId: data.locationId,
            suspectedCount: data.suspectedCount
          });
        } else {
          cities = data.cities;
        }
        res.push({
          name,
          key: en_name,
          value: data.confirmedCount,
          cities: cities
        });
      }
    }
    return res;
  },
  async httpGet(tableName) {
    let MyTableObject = new wx.BaaS.TableObject(tableName);
    return await MyTableObject.count().then(async res => {
      return await MyTableObject.offset(res - 1)
        .find()
        .then(res => {
          return res.data.objects.pop();
        });
    });
  }
};
function getTextName(defaultDate, data) {
  for (let item of defaultDate) {
    // console.log(item.en_name, data[0])
    if (data[0] === item.en_name) {
      // console.log(item)

      return {
        name: `${item.name}`,
        en_name: item.en_name
      };
    }
  }
  return false;
}
