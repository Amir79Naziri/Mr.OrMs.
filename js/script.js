const submit_btn = document.getElementById("submit-btn")
const save_btn = document.getElementById("save-btn")
const clear_btn = document.getElementById("clear-btn")
const result_gender = document.getElementById("result-gender")
const result_percentage = document.getElementById("result-percentage")
const saved_gender = document.getElementById("saved-gender")


function validate_search_name() {
    let name = document.getElementById("search-text").value

    if (name.length === 0) {
        throw new Error("please enter your name")
    } else if (name.length > 255) {
        throw new Error("name is more than 255 character")
    } else
        return name
}


function which_chosen() {
    let radio_btn = document.getElementsByName("gender-btn")
    for (let i = 0; i < radio_btn.length; i++) {
        if (radio_btn[i].checked) return radio_btn[i].value
    }
}

function click_submit() {
    try {
        let name = validate_search_name()
        fetch(`https://api.genderize.io/?name=${name}`)
            .then((result) => {
                if (!result.ok) throw new Error("error")
                return result.json()
            })
            .then((data) => {
                return JSON.stringify(data)
            }).catch((error) => window.alert(error))
    } catch (e) {
        window.alert(e)
    }
}




function click_clear() {

}


function click_save() {

}



submit_btn.addEventListener("click", click_submit)