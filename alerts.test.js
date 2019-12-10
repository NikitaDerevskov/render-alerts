const {stripesToRender} = require('./stripes')

const basic = [{"start": 0, "end": 0, "fg": "orange", "names": {"name": 1}}]

const many_warns = [
    ["WARNING_VOICE_DETECTED", "0:00:02.399738"] ,
    ["WARNING_NO_USER_IN_FRAME", "0:00:02.937426"],
    ["WARNING_PHONE", "0:00:17.304943"],
    ["WARNING_EXTRA_USER_IN_FRAME", "0:00:05.304943"],
    ["WARNING_EXTRA_USER_IN_FRAME", "0:00:50.304943"]]

const many_warns_result = [
    {"end": 3.2399738,"fg": "red",
        "names": {"WARNING_EXTRA_USER_IN_FRAME": 1,"WARNING_NO_USER_IN_FRAME": 1,"WARNING_PHONE": 1,"WARNING_VOICE_DETECTED": 1},
    "start": 0.23997380000000001},
    {"end": 8.0304943,"fg": "orange",
        "names": {"WARNING_EXTRA_USER_IN_FRAME": 1,},
    "start": 5.0304943,}]

const duplicate_warns = [
    ["WARNING_VOICE_DETECTED", "0:00:02.399738"] ,
    ["WARNING_VOICE_DETECTED", "0:00:02.937426"],
    ["WARNING_VOICE_DETECTED", "0:00:17.304943"],
    ["WARNING_VOICE_DETECTED", "0:00:05.304943"],
    ["WARNING_EXTRA_USER_IN_FRAME", "0:00:50.304943"]]

const duplicate_warns_result = [
    {"end": 3.2399738,"fg": "red",
        "names": {"WARNING_VOICE_DETECTED": 4},
        "start": 0.23997380000000001},
    {"end": 8.0304943,"fg": "orange",
        "names": {"WARNING_EXTRA_USER_IN_FRAME": 1},
        "start": 5.0304943,}]

test('stripes if no info', () => {
    expect(stripesToRender(undefined)).toEqual(basic)
    expect(stripesToRender(NaN)).toEqual(basic)
    expect(stripesToRender(0)).toEqual(basic)
    expect(stripesToRender(null)).toEqual(basic)
    expect(stripesToRender([])).toEqual(basic)
})

test('stripes if many warns', () => {
    expect(stripesToRender(many_warns)).toEqual(many_warns_result)
})

test('stripes if duplicate warns', () => {
    expect(stripesToRender(duplicate_warns)).toEqual(duplicate_warns_result)
})
