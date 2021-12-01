const submit_btn = document.getElementById("submit-btn")
const save_btn = document.getElementById("save-btn")
const clear_btn = document.getElementById("clear-btn")
const result_gender = document.getElementById("result-gender")
const result_percentage = document.getElementById("result-percentage")
const saved_gender = document.getElementById("saved-gender")
const search_text = document.getElementById("search-text")
const radio_btn = document.getElementsByName("gender-btn")
const error_message = document.getElementById("error-message")

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
    let radio_btn = document.getElementsByName("gender-btn")
    for (let i = 0; i < radio_btn.length; i++) {
        if (radio_btn[i].checked) return radio_btn[i].value
    }
}

function save_name_on_storage(name, gender) {

    window.localStorage.setItem(name, gender)
}

function load_name_from_storage() {

    let name = validate_search_name()
    let gender = window.localStorage.getItem(name)
    console.log(`${name} loaded from storage, gender is ${gender}`)
    return gender
}


function remove_name_from_storage(name) {
    if (name != null) {
        window.localStorage.removeItem(name)
        console.log(`${name} removed from storage`)
    }
    saved_gender.innerText = ""
}

async function get_data_from_server(name) {

    let url = `https://api.genderize.io/?name=${name}`

    let response = await fetch(url)

    if (!response.ok) {
        throw new Error('some thing went wrong at server')
    }

    let json = await response.json()
}

async function submit_clicked() {

}

async function save_clicked() {
    try {
        let name = validate_search_name()
        let gender = which_gender_chosen()

        save_name_on_storage(name, gender)
    } catch (e) {
        console.log(e.message)
    }
}

async function clear_clicked() {
    if(last_name_from_storage != null) {
        remove_name_from_storage(last_name_from_storage)
    }
}


submit_btn.addEventListener('click', submit_clicked)
save_btn.addEventListener('click', save_clicked)
clear_btn.addEventListener('click', clear_clicked)
