import * as Chart from 'chart.js'
import { findOfferId, weekly3monthsBin } from './contentScript/offerData';

const injectExtension = async () => {
    const element = document.querySelector('[data-box-name="Links-carousel card"]')

    const node = document.createElement('div')
    node.id = 'marketflow-chrome-extension-container'
    node.style.maxWidth = '100vw'
    element.prepend(node)

    const offerId = findOfferId();
    let fetching = true
    let offerData

    while (fetching) {
        await sleep(10)
        console.log('sleeping')
        offerData = await getDataFromStorage(offerId)
        if (offerData) {
            fetching = false
            console.log('got offerdata')
            console.log(offerData)
        }
    }

    const chartData = weekly3monthsBin(offerData[`${offerId}`])
    const layout = makeLayout(chartData)
    node.appendChild(layout)
}

injectExtension()

function getDataFromStorage(offerId) {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get([offerId], function (result) {
            let l = Object.keys(result).length;
            if (l < 1) {
                reject('data not found');
            }
            resolve(result);
        });
    });
}

function makeLayout(data) {

    const layoutNode = document.createElement("div")
    layoutNode.setAttribute("id", "scroogeStatGallery")
    layoutNode.style.cssText = "max-width: 1248px; margin-left: auto; margin-right: auto; width: 100%; margin-bottom: 16px;"


    const css = "<style>    #scrooge-chart-container-grid { grid-area: chart; }    #scrooge-stat-container-grid { grid-area: stat; }  #scrooge-grid-container {   display: grid;    grid-template-areas: 'chart chart chart chart chart chart chart stat';      grid-gap: 15px;      background-color: #eceff1;      padding: 0px;    }        #scrooge-grid-container > div {      background-color: rgba(255, 255, 255, 0.9);      padding: 20px 0;    }    </style>    "

    layoutNode.innerHTML += css

    const gridNode = document.createElement("div")
    gridNode.setAttribute("id", "scrooge-grid-container")

    const chartGridNode = document.createElement("div")
    chartGridNode.setAttribute("id", "scrooge-chart-container-grid")
    gridNode.appendChild(chartGridNode)

    const statGridNode = document.createElement("div")
    statGridNode.setAttribute("id", "scrooge-stat-container-grid")

    const statGrid = document.createElement("div");
    statGridNode.appendChild(statGrid);

    const statCss = "<style> #scrooge-stat-container-grid{ font-family: Open Sans,sans-serif;}          .scroogeStatDesc {  width:160px;       color: #767676; float:left; padding-left: 10px;  padding-right: 10px;}      .scroogeStatVal {  padding-left: 10px;        color: #222;      }</style>";
    statGrid.innerHTML += statCss;
    // statGridNode.innerHTML += '<div class="scroogeStatDesc">Najniższa cena:</div><div class="scroogeStatVal">' + data.lowPrice + ' zł</div>';
    // statGridNode.innerHTML += '<div class="scroogeStatDesc">Najwyższa cena:</div><div class="scroogeStatVal">' + data.highPrice + ' zł</div>';
    // statGridNode.innerHTML += '<div class="scroogeStatDesc">Średnia cena:</div><div class="scroogeStatVal">' + data.averagePrice + ' zł</div>';
    // statGridNode.innerHTML += '<div class="scroogeStatDesc">Wartość sprzedaży:</div><div class="scroogeStatVal">' + data.totalValue.toFixed(0) + ' zł</div>';
    // statGridNode.innerHTML += '<div class="scroogeStatDesc">Sprzedane sztuki:</div><div class="scroogeStatVal">' + data.totalQuantity + ' </div>';
    statGrid.innerHTML += ` <div class="scroogeStatDesc">Najniższa cena:</div><div class="scroogeStatVal">${data.lowPrice} zł</div>
                            <div class="scroogeStatDesc">Najwyższa cena:</div><div class="scroogeStatVal">${data.highPrice} zł</div>
                            <div class="scroogeStatDesc">Średnia cena:</div><div class="scroogeStatVal">${data.averagePrice} zł</div>
                            <div class="scroogeStatDesc">Wartość sprzedaży:</div><div class="scroogeStatVal">${data.totalValue.toFixed(0)} zł</div>
                            <div class="scroogeStatDesc">Sprzedane sztuki:</div><div class="scroogeStatVal">${data.totalQuantity} </div>
                            `

    gridNode.appendChild(statGridNode)

    const canvasContainer = document.createElement("div")
    canvasContainer.setAttribute("id", "scroogeChartContainer")
    canvasContainer.style.width = '100%'
    canvasContainer.style.height = '375px'

    const canvas = document.createElement('canvas')
    canvas.id = "myChart"
    canvas.width = 5
    canvas.height = 2
    canvas.style.zIndex = '8'
    canvas.style.position = "absolute"
    canvas.style.border = "0px solid"
    canvasContainer.appendChild(canvas)

    if (data) {
        renderChart(canvas, data)
    }

    chartGridNode.appendChild(canvasContainer)

    layoutNode.appendChild(gridNode)

    return layoutNode;
}

function renderChart(canvas, data) {
    console.log(data)
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.date,
            datasets: [
                {
                    label: 'Średnia cena sprzedanych produktów',
                    data: data.avgPrice,
                    backgroundColor: 'rgba(200, 50, 50, 0.0)',
                    borderColor: 'rgba(255, 100, 0, 1)',
                    borderWidth: 1,
                    yAxisID: 'avgPriceAxes',
                    radius: 1,
                    lineTension: 0.0,
                    steppedLine: false,
                    order: 1
                },
                {
                    label: 'Sprzedaż (szt.)',
                    data: data.quantity,
                    yAxisID: 'avgPriceAxes',
                    order: 2
                }
            ]
        },
        options: {
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                yAxes: [
                    {
                        id: 'avgPriceAxes',
                        type: 'linear',
                        position: 'left',
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            min: 0,
                            suggestedMax: Math.round(data.highPrice * 1.2)
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Średnia cena'
                        }
                    }
                ]
            }
        }
    });

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}