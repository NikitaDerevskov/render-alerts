/* Utils */

const TIMELINE_END = 1000

let parseHHMMSS = hhmmss => {
    let groups = hhmmss.split(':')
    return (+groups[0]) * 60 * 60 + (+groups[1]) * 60 + (+groups[2])
}

let percent = x => {
    let total = 1000 * TIMELINE_END
    return  100 * x / total
}

let deintersect = (() => {
    let startOf = ([x, _]) => x
    let endOf = ([_, x]) => x
    let nameOf = ([_, __, x]) => x

    let merge = (a, b) => [
        Math.min(...[a, b].map(startOf)),
        Math.max(...[a, b].map(endOf)),
        `${nameOf(a)}/${nameOf(b)}`]

    return x => {
        /* Sort intervals by their starts.*/
        let sorted = x.sort((a, b) => startOf(a) - startOf(b))

        let step = (acc, [f, s, ...rest]) => {
            if (!s) return [...acc, f] // f is the last
            return endOf(f) >= startOf(s) // when instersect
                ? step(acc, [merge(f, s), ...rest])
                : step([...acc, f], [s, ...rest])
        }

        return step([], sorted) || []
    }
})()

let renderAlerts = (alertsData) => {
    const MERGE_RADIUS = 30000
    const HEAT_THRESHOLD = 3

    let getColor = x => x.length > HEAT_THRESHOLD ? 'red' : 'orange'

    let intervals =
        /* Reformat alerts_******* from template */
        alertsData
            .map(x => x ? x : ['name', '00:00:00']) // check no data
            .map(([name, hhmmss]) => [name, parseHHMMSS(hhmmss)*1000, MERGE_RADIUS])
            .map(([name, hhmmss, radius]) => [percent(hhmmss), percent(radius), name])

    let stripes =
        deintersect(intervals)
            .map(x => x ? x : [0, 0, 'name']) // check no data
            .map(([start, duration, names]) => [start, start + duration, names.split('/')])
            .map(([start, end, names]) => ({start, end, fg: getColor(names), names}))

    /* Render element by another code (not in this repo) */

    let counts = xs =>
        xs.reduce((acc, x) => ({
            ...acc, ...(
                x in acc
                    ? {[x]: acc[x] + 1}
                    : {[x]: 1})
        }), {})

    return stripes.map(x => {
        let stripe = {...x}

        stripe.names = counts(x.names)

        return stripe
    })
}

module.exports = {renderAlerts}
