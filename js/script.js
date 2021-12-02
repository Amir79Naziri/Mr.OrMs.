const submit_btn = document.getElementById("submit-btn")
const save_btn = document.getElementById("save-btn")
const clear_btn = document.getElementById("clear-btn")
const result_gender = document.getElementById("result-gender")
const result_percentage = document.getElementById("result-percentage")
const saved_gender = document.getElementById("saved-gender")
const search_text = document.getElementById("search-text")
const radio_btn = document.getElementsByName("gender-btn")
const error_message = document.getElementById("error-message")
const error_box = document.getElementById("error-box")

let last_name_from_storage = null;

function validate_search_name() {
    let name = search_text.value

    if (name.length === 0) {
        throw new Error("please enter your name")
    } else if (name.length > 255) {
        throw new Error("name is more than 255 character")
    } else
        return name
}

function which_gender_chosen() {
    for (let i = 0; i < radio_btn.length; i++) {
        if (radio_btn[i].checked) return radio_btn[i].value.toLowerCase()
    }
}


function free_save_card() {
    saved_gender.style.visibility = "hidden"
    saved_gender.innerText = "saved_gender"
}

function fill_result_card(gender, p) {
    result_gender.innerText = gender
    result_percentage.innerText = p
    result_gender.style.visibility = "visible"
    result_percentage.style.visibility ="visible"
}

function fill_save_card(gender) {
    saved_gender.innerText = gender
    saved_gender.style.visibility = "visible"
}

function fill_error_message (error) {
    error_message.innerText = error
    error_box.style.visibility = "visible"
    setTimeout(() => {
        error_box.style.visibility = "hidden"
        error_message.innerText = "error box"
    }, 4000);
}


async function get_data_from_server() {

    let name = validate_search_name()
    last_name_from_storage = name
    let response = await fetch(`https://api.genderize.io/?name=${name}`)

    if (!response.ok) {
        throw new Error('server connection error')
    }

    let data = await response.json()

    if (data.gender == null) {
        throw new Error('server couldn\'t recognize name')
    }

    return data
}

async function load_name_from_storage() {
    let name = validate_search_name()
    let gender = window.localStorage.getItem(name)
    console.log(`${name} loaded from storage, gender is ${gender}`)
    return gender
}

async function remove_name_from_storage() {
    if (last_name_from_storage != null) {
        window.localStorage.removeItem(last_name_from_storage)
        console.log(`${last_name_from_storage} removed from storage`)
    }
}

async function save_name_on_storage() {
    let name = validate_search_name()
    let gender = which_gender_chosen()
    if (window.localStorage.getItem(name) != null) {
        await remove_name_from_storage(name)
    }
    window.localStorage.setItem(name, gender)
    console.log(`${name} with value ${gender} saved on storage`)
    return gender
}



async function submit_clicked() {
    console.log('submit_clicked')
    try {
        let gender_from_storage = await load_name_from_storage()
        if (gender_from_storage != null) {
            fill_save_card(gender_from_storage)
        }

        let data = await get_data_from_server()
        fill_result_card(data.gender, data.probability)

    } catch (e) {
        console.log(e.message)
        fill_error_message(e.message)
    }
}


async function clear_clicked() {
    console.log('clear_clicked')
    if (last_name_from_storage != null) {
        await remove_name_from_storage(last_name_from_storage)
        free_save_card()
    } else {
        let message = "there isn't any name for clearing"
        console.log(message)
        fill_error_message(message)
    }
}

async function save_clicked() {
    console.log('save_clicked')
    try {
        let gender = await save_name_on_storage()
        fill_save_card(gender)
    } catch (e) {
        console.log(e.message)
        fill_error_message(e.message)
    }
}

submit_btn.addEventListener('click', submit_clicked)
save_btn.addEventListener('click', save_clicked)
clear_btn.addEventListener('click', clear_clicked)
