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
const save_card = document.getElementById("save-card")

let last_name_requested = null;


/**
 * retrieves name from search box and validates it to
 * has alphabetic format and be between 1 to 255 characters
 * @returns requested name
 * @throws errors for wrong name format
 */
function validate_search_name() {
    let name = search_text.value
    if (name.replace(/[a-z\s*]|/gi, '').length > 0) {
        throw new Error("you shouldn't use numbers or non-alphabets")
    } else if (name.length === 0) {
        throw new Error("please enter your name")
    } else if (name.length > 255) {
        throw new Error("name is more than 255 character")
    } else
        return name
}


/**
 * searches on all radio buttons to find out which has been chosen by user
 * @returns value of chosen radio button
 */
function which_gender_chosen() {
    for (let i = 0; i < radio_btn.length; i++) {
        if (radio_btn[i].checked) return radio_btn[i].value.toLowerCase()
    }
}


/**
 * erases all information in result-card and hides it's elements
 */
function free_result_card() {
    result_gender.style.visibility = "hidden"
    result_percentage.style.visibility = "hidden"
    result_gender.innerText = "gender"
    result_percentage.innerText = "percentage"
}


/**
 * erases all information in save-card and hides it's elements
 */
function free_save_card() {
    saved_gender.style.visibility = "hidden"
    saved_gender.innerText = "saved_gender"
}


/**
 * fills result-card by inputs and makes it's element visible
 * @param gender name's gender
 * @param p probability
 */
function fill_result_card(gender, p) {
    result_gender.innerText = gender
    result_percentage.innerText = p
    result_gender.style.visibility = "visible"
    result_percentage.style.visibility ="visible"
}


/**
 * fills save-card by input and makes it's element visible
 * @param gender name's gender
 */
function fill_save_card(gender) {
    saved_gender.innerText = gender
    saved_gender.style.visibility = "visible"
}


/**
 * based on type of error, activates error box and print error message in it
 * type 1 contains search text common errors and server errors
 * type 2 contains clearing from memory error
 * @param error error message
 * @param type type of error , mentioned at description
 */
function fill_error_message (error, type) {
    error_message.innerText = error
    error_box.style.visibility = "visible"
    if (type === 1) {
        search_text.style.outlineStyle = "solid"
        setTimeout(() => {
            search_text.style.outlineStyle = "unset"
            error_box.style.visibility = "hidden"
            error_message.innerText = "error"
        }, 4000);
    } else {
        save_card.style.borderColor = "#ff0810"
        setTimeout(() => {
            save_card.style.borderColor = "#3f7474"
            error_box.style.visibility = "hidden"
            error_message.innerText = "error"
        }, 4000);
    }
}


/**
 * requests from server
 * @returns data from server
 * @throws common errors
 */
async function get_data_from_server() {

    let name = validate_search_name()
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


/**
 * loads names gender from storage
 * @returns name's gender (it can be null if name hasn't been stored on storage)
 */
async function load_name_from_storage() {
    let name = validate_search_name()
    let gender = window.localStorage.getItem(name)
    last_name_requested = name
    console.log(`${name} loaded from storage, gender is ${gender}`)
    return gender
}


/**
 * removes name from storage
 */
async function remove_name_from_storage() {
    if (last_name_requested != null && await window.localStorage.getItem(last_name_requested) != null) {
        window.localStorage.removeItem(last_name_requested)
        console.log(`${last_name_requested} has been removed from storage`)
    } else {
        throw new Error("there isn't anything to delete")
    }
}


/**
 * saves name into storage (also removes last data about this particular name)
 * @returns name's gender
 */
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


/**
 * submit button event handler
 */
async function submit_clicked() {
    console.log('submit_clicked')
    last_name_requested = null
    free_save_card()
    free_result_card()
    try {
        let gender_from_storage = await load_name_from_storage()
        if (gender_from_storage != null) {
            fill_save_card(gender_from_storage)
        }

        let data = await get_data_from_server()
        fill_result_card(data.gender, data.probability)

    } catch (e) {
        console.log(e.message)
        fill_error_message(e.message, 1)
    }
}


/**
 * submit button event handler
 */
async function clear_clicked() {
    console.log('clear_clicked')
    try {
        console.log(last_name_requested)
        await remove_name_from_storage(last_name_requested)
        free_save_card()
    }
    catch (e) {
        console.log(e.message)
        fill_error_message(e.message, 2)
    }
}


/**
 * save button event handler
 */
async function save_clicked() {
    console.log('save_clicked')
    try {
        let gender = await save_name_on_storage()
        fill_save_card(gender)
    } catch (e) {
        console.log(e.message)
        fill_error_message(e.message, 1)
    }
}


// assigning event handlers to buttons
submit_btn.addEventListener('click', submit_clicked)
save_btn.addEventListener('click', save_clicked)
clear_btn.addEventListener('click', clear_clicked)
