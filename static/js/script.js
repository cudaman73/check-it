$(document).ready(function() {
  $('input[type="checkbox"]').click(function() {
    $.ajax({
      url: "/"+ this.name + "/put",
      type: "put",
      data: {listId: this.value, taskId: this.name, checked: this.checked}
    })
  })
});
