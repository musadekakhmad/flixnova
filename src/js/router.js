export function showLayer(id) {

  document.querySelectorAll('[id^="layer-"]').forEach(el => {
    el.classList.add('hidden')
  })

  document.getElementById(id).classList.remove('hidden')

  window.scrollTo(0,0)

}