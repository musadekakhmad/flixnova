export function updateSEO(title,description) {

  document.title = title

  document.querySelector('meta[name="description"]')
    .setAttribute('content',description)

}