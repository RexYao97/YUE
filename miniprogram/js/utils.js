module.exports = {
  handleData(result,defaultDate){
    // console.log(result,defaultDate)
    let res = []
    // console.log(result)
    for (let item of Object.entries(result)){
      let name = getTextName(defaultDate, item)
      if (name) {
        let data = JSON.parse(item[1])
        // console.log(data)
        res.push({
          name,
          value: data.confirmedCount
        })
      }     
    }
    return res
  },
 async httpGet(tableName){
  
    let MyTableObject = new wx.BaaS.TableObject(tableName)
    return await MyTableObject.count().then(async res => {
      return await MyTableObject.offset(res - 1).find().then(res => {
        return res.data.objects.pop()
      })
    })
    
  }
}
function getTextName(defaultDate,data){
  for (let item of defaultDate){
    // console.log(item.en_name, data[0])
    if (data[0] === item.en_name){
      // console.log(item)
      return `${item.name}`
    }
  }
  return false
}