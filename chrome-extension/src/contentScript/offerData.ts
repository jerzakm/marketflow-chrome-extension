import * as moment from 'moment'

export const findOfferId = (url?: string) => {
  //regex approach
  const sUrl = url ? url : window.location.href
  const regexMatch = sUrl.match(/\d{10}/g)
  const offerId = regexMatch.length > 0 ? regexMatch[0] : undefined

  //TODO alternative body search approach
  return offerId
}

export const weekly3monthsBin = (offerData: IOfferDataResponse) => {
  let earliest = Date.now() - (90 * 24 * 60 * 60 * 1000);

  let chartData = {
    date: [],
    value: [],
    quantity: [],
    avgPrice: [],
    type: 'weekly',
    averagePrice: undefined,
    totalValue: 0,
    totalQuantity: 0,
    lowPrice: undefined,
    highPrice: undefined
  };

  let current = moment(earliest).startOf('week').add(1, 'days');
  let end = moment(Date.now());

  while (true) {
    chartData.date.push(current.format('DD-MM-YYYY'));
    chartData.value.push(0);
    chartData.quantity.push(0);
    chartData.avgPrice.push(0);
    if (current.isSameOrAfter(end)) {
      break;
    }
    current.add(7, 'days');
  }


  for (let bid of offerData.data) {
    const time = moment(bid.timestamp * 1000).startOf('week').add(1, 'days').format('DD-MM-YYYY');
    const timeIndex = chartData.date.indexOf(time);
    if (timeIndex > -1) {
      //value
      chartData.value[timeIndex] += bid.quantity * bid.price;
      //quantity
      chartData.quantity[timeIndex] += bid.quantity * 1;

      bid.price < chartData.lowPrice || !chartData.lowPrice ? chartData.lowPrice = bid.price : null
      bid.price > chartData.highPrice || !chartData.highPrice ? chartData.highPrice = bid.price : null

      chartData.totalValue += (bid.price * bid.quantity)
      chartData.totalQuantity += bid.quantity * 1
    }
  }
  for (let i = 0; i < chartData.avgPrice.length; i++) {
    chartData.quantity[i] > 0 ? chartData.avgPrice[i] = chartData.value[i] / chartData.quantity[i] : 0
  }
  chartData.averagePrice = (chartData.totalValue / chartData.totalQuantity).toFixed(2)
  return chartData
}


interface IOfferDataResponse {
  data: OfferDataEntry[]
  offer: string
  timestamp: number
}

//TODO common interfaces for backend and frontend
interface OfferDataEntry {
  timestamp: number
  price: number
  quantity: number
}