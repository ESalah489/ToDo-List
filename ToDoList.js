/* ---------------------------------- Pobup --------------------------------- */
let Target = document.querySelector("#Target");
let cloase = document.querySelector("#cloase");
let pobup = document.getElementById("pobup");
let card = document.getElementById("card");
let Title = document.getElementById("TitleOfTask");
let Discription = document.getElementById("DiscriptionOfTask");
Target.addEventListener("click", function () {
  pobup.style.cssText = "display:flex;transition: all 0.4s linear;";
});
pobup.addEventListener("click", function (e) {
  if (!card.contains(e.target)) {
    pobup.style.display = "none";
  }
});
/* -------------------------- get Data From User  ------------------------- */
let data = JSON.parse(localStorage.getItem("data")) || [];
cloase.addEventListener("click", function (e) {
  let titleName = Title.name;
  let titleValue = Title.value;
  let discName = Discription.name;
  let discValue = Discription.value;
  let date = new Date();
  let DateArray = date;
  DateArray = String(DateArray).split(" ");
  let day = DateArray[2];
  let mon = DateArray[1];
  let year = DateArray[3];
  let FullDate = `${day}-${mon}-${year}`;
  console.log(FullDate);
  let forOneRow = {
    [titleName]: titleValue,
    [discName]: discValue,
    dateOne: `${FullDate}`,
    checkValue: false,
  };
  if (titleValue === "" || discValue === "") {
    e.preventDefault();
    error();
  } else {
    showAlert();
    data.push(forOneRow);
    localStorage.setItem("data", JSON.stringify(data));
    pobup.style.display = "none";
    setTimeout(function () {
      window.location.reload();
    }, 1000);
  }
});
/* ------------------------------- show alert ------------------------------- */
function showAlert() {
  Swal.fire({
    title: "Good job!",
    text: "You Added New Task Good Luck!",
    icon: "success",
    showConfirmButton: false,
  });
}
function error() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong Please Enter a Valid Data!",
    showConfirmButton: false,
    timer: 1500,
    didOpen: () => {
      document.querySelector(".swal2-container").style.zIndex = "100001";
    },
  });
}
/* -------------------------- Display Data In Table ------------------------- */
let DataGet = JSON.parse(localStorage.getItem("data"));
let RowsInOnePage = 1;
let CurrentPage = 1;
function RenderPages() {
  let contentContainer = document.querySelector("#DataTasks");
  contentContainer.innerHTML = "";
  let Start = (CurrentPage - 1) * RowsInOnePage;
  DataGet.forEach(function (element, index) {
    let isChecked = element.checkValue ? "checked" : "";
    let textDecoration = element.checkValue
      ? "text-decoration: line-through;"
      : "text-decoration: none;";
    let oneTask = document.createElement("div");
    oneTask.classList.add("_OneTask");
    oneTask.innerHTML = `
        <div class="_Number _NumCheck number"><span>${
          Start + index + 1
        }</span></div>
        <div class='_NumCheck check' ><input type="checkbox" ${isChecked}/></div>
                <div class="_Title-disc">
                  <h3 class='_Title'>${element.title}</h3>
                  <p class='_Disc' style="${textDecoration}">${element.Disc}</p>
                   <p class='_NumCheck number'style="  text-align: left;" >${
                     element.dateOne
                   }</p>
                </div>
                <div class="_Action">
                <button class='Edit'>edit</button><button class='Delete'>delete</button>
                <button class='Save hidden'>Save</button><button class='Cancle hidden'>Cancle</button>
                </div>`;
    contentContainer.appendChild(oneTask);
  });
  AttachDeleteEvents();
  CheckValue();
  AttachEditEvents();
  AttachSearchEvents();
  AttachSearchEventsByDate();
}
/* -------------------------- delete Data In Table ------------------------- */
function AttachDeleteEvents() {
  let deleteButtons = document.querySelectorAll(".Delete");
  deleteButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      let realIndex = (CurrentPage - 1) * RowsInOnePage + index;
      data.splice(realIndex, 1);
      localStorage.setItem("data", JSON.stringify(data));
      RenderPages();
      window.location.reload();
    });
  });
}
/* ------------------------------- check value ------------------------------ */
function CheckValue() {
  let checkbox = document.querySelectorAll(".check input[type='checkbox']");
  checkbox.forEach(function (check, index) {
    check.addEventListener("change", function () {
      let realIndex = (CurrentPage - 1) * RowsInOnePage + index;
      data[realIndex].checkValue = this.checked;
      localStorage.setItem("data", JSON.stringify(data));
      let taskElement = this.closest("._OneTask");
      let discElement = taskElement.querySelector("._Disc");
      if (discElement) {
        discElement.style.textDecoration = this.checked
          ? "line-through"
          : "none";
      }
    });
  });
}

/* ------------------------------- Edit Data  ------------------------------ */
function AttachEditEvents() {
  let editButtons = document.querySelectorAll(".Edit");
  editButtons.forEach(function (button, index) {
    let saveButtons = document.getElementsByClassName("Save")[index];
    let cancelButtons = document.getElementsByClassName("Cancle")[index];
    let deleteButtons = document.getElementsByClassName("Delete")[index];
    button.addEventListener("click", function () {
      saveButtons.classList.remove("hidden");
      cancelButtons.classList.remove("hidden");
      this.classList.add("hidden");
      deleteButtons.classList.add("hidden");
      let parent = this.parentElement.parentElement;
      console.log(parent.children[2]);
      console.log(parent.children[2].children[1]);
      let titleValue = parent.children[2].children[0].innerHTML;
      parent.children[2].children[0].innerHTML = `<input type="text" name="title" placeholder="Title" id="TitleOfTask" class='SaveInp' value='${titleValue}' />`;
      let Titlevalues = "";
      parent.children[2].children[0].firstElementChild.addEventListener(
        "input",
        function () {
          Titlevalues = this.value;
        }
      );
      let DiscValue = parent.children[2].children[1].innerHTML;
      parent.children[2].children[1].innerHTML = `<input type="text" name="disc" placeholder="Title" id="TitleOfTask" class='SaveInp' value='${DiscValue}' />`;
      let Discvalues = "";
      parent.children[2].children[1].firstElementChild.addEventListener(
        "input",
        function () {
          Discvalues = this.value;
        }
      );
      cancelButtons.addEventListener("click", function () {
        saveButtons.classList.add("hidden");
        this.classList.add("hidden");
        button.classList.remove("hidden");
        deleteButtons.classList.remove("hidden");
        parent.children[2].children[0].innerHTML = titleValue;
        parent.children[2].children[1].innerHTML = DiscValue;
      });
      saveButtons.addEventListener("click", function () {
        let newTitle = parent.children[2].children[0]
          .querySelector("input")
          .value.trim();
        let newDesc = parent.children[2].children[1]
          .querySelector("input")
          .value.trim();
        parent.children[2].children[0].innerHTML = newTitle;
        parent.children[2].children[1].innerHTML = newDesc;
        let realIndex = (CurrentPage - 1) * RowsInOnePage + index;
        data[realIndex].title = newTitle;
        data[realIndex].Disc = newDesc;
        localStorage.setItem("data", JSON.stringify(data));
        cancelButtons.classList.add("hidden");
        this.classList.add("hidden");
        button.classList.remove("hidden");
        deleteButtons.classList.remove("hidden");
      });
    });
  });
}
/* ----------------------- Search about value in table ---------------------- */

function AttachSearchEvents() {
  let Search = document.querySelector("#Search");
  Search.addEventListener("click", function (e) {
    e.preventDefault();
    Swal.fire({
      title: "Search Task",
      input: "text",
      inputLabel: "Enter Title",
      inputPlaceholder: "Type here...",
      showCancelButton: true,
      confirmButtonText: "Search",
      confirmButtonColor: "#202d48",
    }).then((result) => {
      if (result.isConfirmed) {
        let resultInArray = [];
        data.forEach(function (element, index) {
          if (element.title == result.value) {
            resultInArray.push(element);
          }
        });
        let table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        resultInArray.forEach(function (element, index) {
          let isChecked = element.checkValue ? "checked" : "";
          let textDecoration = element.checkValue
            ? "text-decoration: line-through;"
            : "text-decoration: none;";
          let oneRow = document.createElement("tr");
          oneRow.innerHTML = `<td class='_NumCheck check' style="border:1px solid #000"><input type="checkbox" ${isChecked}/></td>
                              <td class='_Title' style="border:1px solid #000">${element.title}</td>
                              <td class='_Disc'" style="border:1px solid #000;${textDecoration}">${element.Disc}</td>`;
          table.appendChild(oneRow);
        });
        CheckValue();
        if (resultInArray.length !== 0) {
          Swal.fire({
            title: "Searched Data",
            html: table.outerHTML,
            width: "80%",
          });
        } else {
          NoData();
        }
      }
    });
  });
}

/* ----------------------------- search bu Date ----------------------------- */
function AttachSearchEventsByDate() {
  document
    .querySelector("#SearchByDate")
    .addEventListener("click", function () {
      let selectedDate = document.querySelector("#FromData").value;
      if (!selectedDate) {
        NoData();
        return;
      }
      let dateObj = new Date(selectedDate);
      let day = String(dateObj.getDate()).padStart(2, "0");
      let month = dateObj.toLocaleString("default", { month: "short" });
      let year = dateObj.getFullYear();
      let formattedDate = `${day}-${month}-${year}`;

      let resultInArray = data.filter((task) => task.dateOne === formattedDate);

      let table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";

      resultInArray.forEach(function (element) {
        let isChecked = element.checkValue ? "checked" : "";
        let textDecoration = element.checkValue
          ? "text-decoration: line-through;"
          : "text-decoration: none;";
        let oneRow = document.createElement("tr");
        oneRow.innerHTML = `<td class='_NumCheck check' style="border:1px solid #000"><input type="checkbox" ${isChecked}/></td>
                        <td class='_Title' style="border:1px solid #000">${element.title}</td>
                        <td class='_Disc' style="border:1px solid #000;${textDecoration}">${element.Disc}</td>`;
        table.appendChild(oneRow);
      });

      if (resultInArray.length !== 0) {
        Swal.fire({
          title: "Tasks on " + formattedDate,
          html: table.outerHTML,
          width: "80%",
        });
      } else {
        NoData();
      }
    });
}

function NoData() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "No Data Founded",
    showConfirmButton: false,
    timer: 1500,
    didOpen: () => {
      document.querySelector(".swal2-container").style.zIndex = "100001";
    },
  });
}
RenderPages();
