import * as Chart from 'chart.js'
import { getOfferdata, findOfferId, weekly3monthsBin } from './contentScript/offerData';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.color) {
        console.log('Receive color = ' + msg.color);
        document.body.style.backgroundColor = msg.color;
        sendResponse('Change color to ' + msg.color);
    } else {
        sendResponse('Color message is none.');
    }
    const a = $.ajax;
});

const injectExtension = async () => {
    const element = document.querySelector('[data-box-name="Links-carousel card"]')

    const node = document.createElement('div')
    node.id = 'marketflow-chrome-extension-container'
    node.style.maxWidth = '100vw'
    element.prepend(node)

    const offerId = findOfferId()
    const offerData = await getOfferdata(offerId)
    const chartData = weekly3monthsBin(offerData)
    const layout = makeLayout(chartData)
    node.appendChild(layout)
}

injectExtension()

function makeLayout(data) {

    let layoutNode = document.createElement("div")
    layoutNode.setAttribute("id", "scroogeStatGallery")
    layoutNode.style.cssText = "max-width: 1248px; margin-left: auto; margin-right: auto; width: 100%; margin-bottom: 16px;"


    let css = "<style>    #scrooge-chart-container-grid { grid-area: chart; }    #scrooge-stat-container-grid { grid-area: stat; }  #scrooge-grid-container {   display: grid;    grid-template-areas: 'chart chart chart chart chart chart chart stat';      grid-gap: 15px;      background-color: #eceff1;      padding: 0px;    }        #scrooge-grid-container > div {      background-color: rgba(255, 255, 255, 0.9);      padding: 20px 0;    }    </style>    "

    layoutNode.innerHTML += css

    let gridNode = document.createElement("div")
    gridNode.setAttribute("id", "scrooge-grid-container")

    let chartGridNode = document.createElement("div")
    chartGridNode.setAttribute("id", "scrooge-chart-container-grid")
    gridNode.appendChild(chartGridNode)

    let statGridNode = document.createElement("div")
    statGridNode.setAttribute("id", "scrooge-stat-container-grid")

    let statGrid = document.createElement("div");
    statGridNode.appendChild(statGrid);

    let statCss = "<style> #scrooge-stat-container-grid{ font-family: Open Sans,sans-serif;}          .scroogeStatDesc {  width:160px;       color: #767676; float:left; padding-left: 10px;  padding-right: 10px;}      .scroogeStatVal {  padding-left: 10px;        color: #222;      }</style>";
    statGrid.innerHTML += statCss;
    statGridNode.innerHTML += '<div class="scroogeStatDesc">Najniższa cena:</div><div class="scroogeStatVal">' + data.lowPrice + ' zł</div>';
    statGridNode.innerHTML += '<div class="scroogeStatDesc">Najwyższa cena:</div><div class="scroogeStatVal">' + data.highPrice + ' zł</div>';
    statGridNode.innerHTML += '<div class="scroogeStatDesc">Średnia cena:</div><div class="scroogeStatVal">' + data.averagePrice + ' zł</div>';
    statGridNode.innerHTML += '<div class="scroogeStatDesc">Wartość sprzedaży:</div><div class="scroogeStatVal">' + data.totalValue.toFixed(0) + ' zł</div>';
    statGridNode.innerHTML += '<div class="scroogeStatDesc">Sprzedane sztuki:</div><div class="scroogeStatVal">' + data.totalQuantity + ' </div>';

    gridNode.appendChild(statGridNode);

    let canvasContainer = document.createElement("div")
    canvasContainer.setAttribute("id", "scroogeChartContainer")
    canvasContainer.style.width = '100%';
    canvasContainer.style.height = '375px'

    let canvas = document.createElement('canvas')
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
        type: 'bar',
        data: {
            labels: data.date,
            datasets: [
                {
                    label: 'Średnia cena',
                    data: data.avgPrice,
                    type: 'line',
                    backgroundColor: 'rgba(200, 50, 50, 0.0)',
                    borderColor: 'rgba(255, 100, 0, 1)',
                    borderWidth: 1,
                    yAxisID: 'first-y-axis',
                    radius: 1,
                    lineTension: 0.15,
                    steppedLine: false
                },
                // {
                //     label: 'Sprzedaż (PLN)',
                //     data: data.value,
                //     type: 'line',
                //     borderColor: 'rgba(255, 255, 255, 1)',
                //     borderWidth: 1,
                //     yAxisID: 'fake-axis',
                //     showLine: false,
                //     pointStyle: 'rectRot',
                //     radius: 0
                // },
                // {
                //     label: 'Sprzedaż (szt.)',
                //     data: data.quantity,
                //     type: 'bar',
                //     backgroundColor: 'rgba(66, 35, 123, 0.9)',
                //     borderColor: 'rgba(255, 255, 255, 1)',
                //     borderWidth: 1,
                //     yAxisID: 'second-y-axis'
                // }
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
                        id: 'first-y-axis',
                        type: 'linear',
                        position: 'left',
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            min: Math.round(data.lowPrice * 0.8),
                            suggestedMax: Math.round(data.highPrice * 1.2)
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Średnia cena'
                        }
                    },
                    // {
                    //     id: 'fake-axis',
                    //     type: 'linear',
                    //     position: 'right',
                    //     gridLines: {
                    //         display: false
                    //     },
                    //     display: true,
                    //     scaleLabel: {
                    //         display: true,
                    //         labelString: 'Sprzedaż (PLN)'
                    //     }
                    // },
                    // {
                    //     id: 'second-y-axis',
                    //     type: 'linear',
                    //     position: 'right',
                    //     display: false,
                    //     scaleLabel: {
                    //         display: true,
                    //         labelString: 'Sprzedaż (szt.)'
                    //     }
                    // }
                ]
            }
        }
    });

}
