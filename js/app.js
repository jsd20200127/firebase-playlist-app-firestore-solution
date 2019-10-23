$(function () {
  // Fill in your firebase project's information below:

  const firebaseConfig = {
    apiKey: 'your_api_key',
    authDomain: 'your_project_id.firebaseapp.com',
    databaseURL: 'https://your_database_name.firebaseio.com',
    projectId: 'add_your_project_id',
    storageBucket: 'your_bucket_name.appspot.com',
    storageBucket: 'add_your_storage_bucket_url',
    messagingSenderId: 'add_your_messaging_sender_id',
    appId: 'add_your_app_id'
  }

  // Initialize firebase application with
  // config object above
  firebase.initializeApp(firebaseConfig)

  // Firebase API - Create a reference to "song" node in
  // your firebase database
  const dbSongs = firebase.firestore().collection('songs')
  console.log(dbSongs)

  // -------- **CREATE** ---------

  // listen for submit event on Add New Song form
  $('#song-form').submit((event) => {
    event.preventDefault()
    console.log($('#song-name').val())
    console.log($('#artist-name').val())

    // Firebase API - Add new song using .push()
    dbSongs.add({
      songName: $('#song-name').val(),
      artistName: $('#artist-name').val(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    clearAddFormFields()
  })

  // -------- **READ** ---------

  // Firebase API - list for real-time changes to the "songs" collection
  dbSongs.orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
    console.log(snapshot)

    // clear songs list
    $('.songs').html('')

    snapshot.forEach((doc) => {
      const songId = doc.id
      const songName = doc.data().songName
      const artistName = doc.data().artistName
      const playlistItemHtml = buildSongItemHtml(songName, artistName)

      $('.songs')
        .append(
          `<div class="song" id="${songId}">
            ${playlistItemHtml}
          </div>`
        )
    })
  })

  // -------- **UPDATE** ---------

  // listen for click event on the "edit" button
  $('body').on('click', 'button.edit-song', (event) => {
    const selectedSongId = $(event.currentTarget).parent().parent().attr('id')
    const selectedSongName = $(event.currentTarget).parent().parent().find('.song-name').text()
    const selectedArtistName = $(event.currentTarget).parent().parent().find('.artist-name').text()

    console.log(selectedSongId)
    console.log(selectedSongName)
    console.log(selectedArtistName)

    const formHtml = buildEditFormHtml(selectedSongId, selectedSongName, selectedArtistName)

    $(event.currentTarget).parent().parent().html(formHtml)
  })

  // listen for click event on the "cancel" (edit) link
  $('body').on('click', '.song .cancel-edit', (event) => {
    const songId = $(event.currentTarget).parent().find('#song-id').val()
    const songName = $(event.currentTarget).parent().find('#update-song-name').val()
    const artistName = $(event.currentTarget).parent().find('#update-artist-name').val()

    console.log(songId)
    console.log(songName)
    console.log(artistName)

    const playlistItemHtml = buildSongItemHtml(songName, artistName)

    $(event.currentTarget).parent().parent().html(playlistItemHtml)
  })

  // listen for the submit event for update song form
  $('body').on('submit', '#update-song-form', (event) => {
    event.preventDefault()

    const songId = $(event.currentTarget).parent().find('#song-id').val()
    const updatedSongName = $(event.currentTarget).parent().find('#update-song-name').val()
    const updatedArtistName = $(event.currentTarget).parent().find('#update-artist-name').val()

    console.log(songId)
    console.log(updatedSongName)
    console.log(updatedArtistName)

    // Firebase API - update song using its ID
    dbSongs.doc(songId).update({
      songName: updatedSongName,
      artistName: updatedArtistName
    })

    // const playlistItemHtml = buildSongItemHtml(updatedSongName, updatedArtistName)
    // $(event.currentTarget).parent().parent().html('')
  })

  // -------- **DELETE** ---------

  // listen for click event on the "delete" button
  $('body').on('click', 'button.delete-song', (event) => {
    const songId = $(event.currentTarget).parent().parent().attr('id')
    console.log(songId)

    // Firebase API - remove song from database using it's ID
    dbSongs.doc(songId).delete()

    // $(event.currentTarget).parent().parent().remove()
  })

  // -------- Utility Functions ---------

  // html template for Edit Song Form
  function buildEditFormHtml (songId, songName, artistName) {
    return (
      `
        <form id="update-song-form">
          <p>Update Song</p>
          <input type="text" id="update-song-name" value="${songName}"/>
          <input type="text" id="update-artist-name" value="${artistName}"/>
          <input type="hidden" id="song-id" value="${songId}"/>
          <button>Update Song</button>
          <a href="#" class="cancel-edit"> cancel </a>
        </form>
      `
    )
  }

  // html template for a Song Item
  function buildSongItemHtml (songName, artistName) {
    return (
      `<div class="song-name">${songName}</div>
        <div class="artist-name">${artistName}</div>

        <div class="actions">
          <button class="edit-song">edit</a>
          <button class="delete-song">delete</a>
        </div>`
    )
  }

  // Clear text fields on Add New Song form
  function clearAddFormFields () {
    $('#song-name').val('')
    $('#artist-name').val('')
  }
})
