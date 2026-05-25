export function openPlayer(type,id) {

  const frame = document.getElementById('player-frame')

  frame.src = `https://vidsrc.to/embed/${type}/${id}`

}