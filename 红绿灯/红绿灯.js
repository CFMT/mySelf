/* 使用promise 实现红绿灯颜色的跳转
绿灯执行三秒后
黄灯执行四秒后
红灯执行五秒 */

let traffic = document.getElementById('traffic')

function greenLight () {
    return new Promise((resolve, reject) => {
        traffic.className = 'green'
        setTimeout(() => {
            traffic.className = ''
            resolve()
        }, 3000)
    })
}

function yellowLight () {
    return new Promise((resolve, reject) => {
        traffic.className = 'yellow'
        setTimeout(() => {
            traffic.className = ''
            resolve()
        }, 4000)
    })
}

function redLight () {
    return new Promise((resolve, reject) => {
        traffic.className = 'red'
        setTimeout(() => {
            traffic.className = ''
            resolve()
        }, 5000)
    })
}


function light (name, time) {
    return new Promise((resolve, reject) => {
        traffic.className = name
        setTimeout(() => {
            traffic.className = ''
            resolve()
        }, time)
    })
}

const finish = async function () {
    // let green = await greenLight()
    // let yellow = await yellowLight()
    // let red = await redLight()
    let green = await light('green', 3000)
    let yellow = await light('yellow', 4000)
    let red = await light('red', 5000)
}

console.time('ss')
finish().then(() => {
    console.timeEnd('ss')
    alert('OK')
}).catch(() => {
    alert('NO')
})
