const artist = ["Adele", "21 Pilots", "Maluma", "Bruno Mars", "Fall Out Boy", "Enrique Iglesias"]
const years = ['1958', '1959', '1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']
const songs_line = []
const songs_radar = []
const songs_bar = []
const songs_doughnut = []

run()

function run() {
    fetch('data/data.json').then(response => { return response.json(); })
    .then(data => {

        lineGraph(data)
        barGraph(data)
        enableEventHandlers(data)
    })
}

//Grafico Lineal
const lineGraph = base => {
    const values = lineForm(base, true)
    const ranking = document.querySelector('#line_ranking').value
    var y_max
    if (Number(ranking) == 1) y_max = 50
    if (Number(ranking) == 10) y_max = 300
    if (Number(ranking) == 20) y_max = 500
    if (Number(ranking) == 30) y_max = 800
    if (Number(ranking) == 40) y_max = 1000
    if (Number(ranking) == 50) y_max = 1100
    const data = {
        labels: values[0],
        datasets:[
            {
                label: "Cantidad de colaboraciones por año",
                data: values[1],
                borderColor: 'rgba(0, 34, 255, 0.5)',
                tension: .5,
                pointBorderWidth: 3,
                fill: false
            }
        ]
    }

    const options = {
        responsive: true,
        scales: {
            y: {
                min: 0,
                max: y_max,
            }
        }
    }

    new Chart('line_graph', { type: 'line', data, options });
}

const lineForm = (data, recalc) => {
    const val_years = []
    const val_songs = []
    let aux = 0
    const time = document.querySelector('#line_time').value
    if (recalc) {
        const ranking = document.querySelector('#line_ranking').value
        calc_collaborations(data, ranking)
    }
    
    if (Number(time) == 0) {
        for (let i = 0; i < years.length; i++) {
            val_years[i] = years[i]
            val_songs[i] = songs_line[i]
        }
    }
    else if (Number(time) > 0 && Number(time) < 9) {
        for (let i = 0; i < years.length; i++) {
            if (years[i] < 1940 + Number(time) * 10) continue
            if (years[i] >= 1940 + (Number(time) + 1) * 10) break
            val_years[aux] = years[i]
            val_songs[aux] = songs_line[i]
            aux++
        }
    }
    else if (Number(time) == 9) {
        for (let i = 0; i < 42; i++) {
            val_years[i] = years[i]
            val_songs[i] = songs_line[i]
        }
    }
    else {
        for (let i = 42; i < years.length; i++) {
            val_years[i - 42] = years[i]
            val_songs[i - 42] = songs_line[i]
        }
    }
    return [val_years, val_songs]
}

const calc_collaborations = (data, ranking) => {
    for (let i = 0; i < years.length; i++) {
        songs_line[i] = 0        
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].featuring && data[i].rank <= Number(ranking)) {
            let aux = data[i].year - 1958
            songs_line[aux]++
        }
    }
}


const calc_popular_songs = (data, ranking, time) => {
    let songs = new Map()
    let id_songs = new Map()
    let artist = new Map()
    const song_name = []
    const artist_name = []
    const count = []
    let min
    let max
    if(Number(time)==0)
    {
        min = 1958
        max = 2021
    }
    else if(Number(time)>0 && Number(time)<9)
    {
        min = 1940 + Number(time) * 10
        max = (1940 + (Number(time)+1) * 10)-1
    }
    else if(Number(time)==9)
    {
        min = 1958
        max = 1999
    }
    else
    {
        min = 2000
        max = 2021
    }

    for (let i = 0; i < data.length; i++) {
        let song=data[i]
        if (song.featuring && song.rank <= Number(ranking) && song.year>=min && song.year<=max) {
            
            if(songs.has(song.ID))
            {
                songs.set(song.ID,songs.get(song.ID)+1)
            }
            else
            {
                songs.set(song.ID,1)
                id_songs.set(song.ID,song.song)
                artist.set(song.ID,song.artist)

            }
        }

    }
    var order_array = Array.from(songs)
    order_array.sort(function(a,b){return b[1] - a[1]})

    for (let i = 0; i < 10; i++) {
        count[i] = order_array[i][1]
        song_name[i] = id_songs.get(order_array[i][0])
        artist_name[i] = artist.get(order_array[i][0])
    }
    return [song_name, count, artist_name]

}


//Grafico de barra
const barGraph = base => {
    const ranking = document.querySelector('#bar_ranking').value
    const time = document.querySelector('#bar_time').value
    const values = calc_popular_songs(base,ranking,time)
    var y_max
    if (Number(ranking) == 1) y_max = 25
    if (Number(ranking) == 10) y_max = 35
    if (Number(ranking) == 20) y_max = 50
    if (Number(ranking) == 30) y_max = 55
    if (Number(ranking) == 40) y_max = 60
    if (Number(ranking) == 50) y_max = 65
    
    const data = {
        labels: values[0],
        datasets:[
            {
                label: "Colaboraciones más populares",
                data: values[1],
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: ''
          }
        },
        scales: {
          y: {
            min: 0,
            max: y_max,
          }
        }
    }

    new Chart('bar_graph', { type: 'bar', data, options });
}






//Handlers de select
const enableEventHandlers = data => {

    document.querySelector('#line_time').onchange = e => {
        const val = lineForm(data, false)
        updateLine('line_graph', val)
    }

    document.querySelector('#line_ranking').onchange = e => {
        const val = lineForm(data, true)
        updateLine('line_graph', val)
    }



    document.querySelector('#bar_time').onchange = e => {
        let time = document.querySelector('#bar_time').value
        let ranking = document.querySelector('#bar_ranking').value
        const val = calc_popular_songs(data, ranking, time)
        updateBar('bar_graph', val)
    }

    document.querySelector('#bar_ranking').onchange = e => {
        let time = document.querySelector('#bar_time').value
        let ranking = document.querySelector('#bar_ranking').value
        const val = calc_popular_songs(data, ranking, time)
        updateBar('bar_graph', val)
    }

  
}

//Update
const updateLine = (chartId, val) => {
    const chart = Chart.getChart(chartId);
    chart.data.labels = val[0]
    chart.data.datasets[0].data = val[1]
    const ranking = document.querySelector('#line_ranking').value
    if (Number(ranking) == 1) chart.options.scales.y.max = 50
    if (Number(ranking) == 10) chart.options.scales.y.max = 300
    if (Number(ranking) == 20) chart.options.scales.y.max = 500
    if (Number(ranking) == 30) chart.options.scales.y.max = 800
    if (Number(ranking) == 40) chart.options.scales.y.max = 1000
    if (Number(ranking) == 50) chart.options.scales.y.max = 1100
    chart.update()   
}



const updateBar = (chartId, val) => {
    const chart = Chart.getChart(chartId);
    chart.data.labels = val[0]
    chart.data.datasets[0].data = val[1]
    const ranking = document.querySelector('#bar_ranking').value
    if (Number(ranking) == 1) chart.options.scales.y.max = 25
    if (Number(ranking) == 10) chart.options.scales.y.max = 35
    if (Number(ranking) == 20) chart.options.scales.y.max = 50
    if (Number(ranking) == 30) chart.options.scales.y.max = 55
    if (Number(ranking) == 40) chart.options.scales.y.max = 60
    if (Number(ranking) == 50) chart.options.scales.y.max = 65
    chart.update()
}

