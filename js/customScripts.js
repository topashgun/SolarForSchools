var lists = [];

document.getElementById('addNewList').onclick = function () {
  var getExistingNumberOfLists = document.querySelectorAll('#listsDiv .listColumn').length;
  var newCardTempalte = '<div class="col-lg-3 col-md-6 col-12 listColumn mt-2" data-id="' + (getExistingNumberOfLists + 1) + '"> <div class="card customCard" data-id="' + (getExistingNumberOfLists + 1) + '"> <h5 class="card-header customCardHeader">To Do List ' + (getExistingNumberOfLists + 1) + ' <i class="fas fa-trash-alt deleteIcon" onclick="deleteFunction(' + (getExistingNumberOfLists + 1) + ')" data-id=' + (getExistingNumberOfLists + 1) + '></i></h5> <div class="card-body customCardBody" data-id="' + (getExistingNumberOfLists + 1) + '"><div class="card toDoListCard" id="sortLists' + (getExistingNumberOfLists + 1) + '"></div></div></div><div class="row"> <div class="col-12"> <button type="button" class="btn btn-block btn-sm btn-warning addNewCard" onclick="myFunction(' + (getExistingNumberOfLists + 1) + ')" data-toggle="modal" data-target="#addCardModal" data-id="' + (getExistingNumberOfLists + 1) + '">Add New Card</button> </div></div></div></div>';
  document.getElementById('listsDiv').innerHTML += newCardTempalte;
  // var addCard = document.querySelector('.addNewCard[data-id="' + (getExistingNumberOfLists + 1) + '"]');
  // addCard.onclick = function () {
  //   document.getElementById('cardTitle').value = '';
  //   document.getElementById('cardDescription').value = '';
  //   document.getElementById('saveNewCard').setAttribute("data-id", (getExistingNumberOfLists + 1));
  // }
  var listObject = new Object();
  listObject.toDoList = getExistingNumberOfLists + 1;
  listObject.Lists = [];
  lists.push(listObject)
}

document.getElementById('saveNewCard').onclick = function () {
  document.getElementById('cardTitle').classList.remove('redBorder');
  document.getElementById('cardDescription').classList.remove('redBorder');
  if (document.getElementById('cardTitle').value.trim().length != 0 && document.getElementById('cardDescription').value.trim().length != 0) {
    var activeCardId = this.getAttribute("data-id");
    var getExistingNumberOfCards = document.querySelectorAll('.customCardBody[data-id="' + activeCardId + '"] .toDoListCard .card').length;
    var populateRow = "<div class='row m-0'><div class='col-10 p-0'>" + document.getElementById('cardTitle').value + "</div><div class='col-1 p-0 text-right editIcon' data-toggle='modal' data-target='#editCardModal' onclick='editButtonClick(" + activeCardId + "," + (getExistingNumberOfCards + 1) + ")'><i class='fas fa-edit'></i></div><div class='col-1 p-0 text-right deleteCardIcon' onclick='deleteCardClick(" + activeCardId + "," + (getExistingNumberOfCards + 1) + ")'><i class='fas fa-trash'></i></div></div>"
    var populateCard = '<div class="card" data-id="' + (getExistingNumberOfCards + 1) + '"> <div class="card-body">' + populateRow + '</div></div>'
    document.querySelector('.customCardBody[data-id="' + activeCardId + '"] .toDoListCard').innerHTML += populateCard

    var cardObject = new Object();
    cardObject.title = document.getElementById('cardTitle').value;
    cardObject.description = document.getElementById('cardDescription').value;
    cardObject.id = getExistingNumberOfCards + 1;
    cardObject.comments = [];
    lists[getListIndex(activeCardId)].Lists.push(cardObject);

    document.getElementById('cardTitle').value = '';
    document.getElementById('cardDescription').value = '';

    var el = document.getElementById("sortLists" + activeCardId);
    new Sortable(el, {
      animation: 150,
      ghostClass: 'blue-background-class'
    })

    document.getElementById('cardAddedAlert').style.display = "inline-block";
    setTimeout(function () {
      document.getElementById('cardAddedAlert').style.display = "none";
    }, 1500)
  } else {
    if (document.getElementById('cardTitle').value.trim().length == 0) {
      document.getElementById('cardTitle').classList.add('redBorder');
    }

    if (document.getElementById('cardDescription').value.trim().length == 0) {
      document.getElementById('cardDescription').classList.add('redBorder');
    }
  }
}

document.getElementById('editCard').onclick = function () {
  var listId = this.getAttribute("data-listId");
  var cardId = this.getAttribute("data-cardId");
  var commentObject = new Object();
  commentObject.comment = document.getElementById('addComment').value;
  commentObject.timestamp = getFormattedDate();
  lists[listId - 1].Lists[cardId - 1].comments.push(commentObject);
  populateComments(listId, cardId)
  document.getElementById('addComment').value = '';
}

function myFunction(dataId) {
  document.getElementById('cardTitle').value = '';
  document.getElementById('cardDescription').value = '';
  document.getElementById('saveNewCard').setAttribute("data-id", dataId);
}

function editButtonClick(listId, dataId) {
  var title = lists[listId - 1].Lists[dataId - 1].title
  var description = lists[listId - 1].Lists[dataId - 1].description
  document.getElementById('editCardTitle').innerHTML = title;
  document.getElementById('editCardDescription').innerHTML = description;

  document.getElementById('editCard').setAttribute("data-listId", listId);
  document.getElementById('editCard').setAttribute("data-cardId", dataId);

  populateComments(listId, dataId);
}

function populateComments(listId, dataId) {
  var comments = lists[listId - 1].Lists[dataId - 1].comments;
  document.getElementById('commentsSection').innerHTML = "";
  for (let i = 0; i < comments.length; i++) {
    document.getElementById('commentsSection').innerHTML += '<blockquote class="blockquote"> <p class="mb-0 commentP">' + comments[i].comment + '</p><footer class="blockquote-footer commentTime"><cite title="Source Title">' + comments[i].timestamp + '</cite></footer></blockquote>';
  }
}

function getListIndex(toDoListId) {
  var listIndex = lists.findIndex(tempIndex => tempIndex.toDoList == toDoListId);
  return listIndex;
}

function deleteFunction(dataId) {
  var getDeleteIndex = getListIndex(dataId)
  lists.splice(getDeleteIndex, 1);
  document.querySelector('.listColumn[data-id="' + dataId + '"]').remove();
  console.log("clicking delete " + getDeleteIndex);
  console.log(JSON.stringify(lists))
}

function deleteCardClick(listId, Cardid) {
  lists[listId - 1].Lists.splice(Cardid - 1, 1);
  document.querySelector('.customCardBody[data-id="' + listId + '"] .card[data-id="' + Cardid + '"]').remove();
}

function getFormattedDate() {
  var date = new Date();
  var meridian = 'AM';
  var hours = date.getHours();
  if (hours > 12) {
    hours = Number(hours) - 12;
    meridian = 'PM'
  }

  var str = addZero(hours) + ":" + addZero(date.getMinutes()) + " " + meridian;

  return str;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}