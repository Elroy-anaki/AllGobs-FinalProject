// Define the URLS
const urlJobsByCategory = "https://remotive.com/api/remote-jobs?category=";
const urlSearch = "https://remotive.com/api/remote-jobs?search=";

// Catch The elements
const dropdownCategories = document.querySelector("#dropdown-categories");
const helloSection = document.querySelector("#hello-section");
const jobsContainer = document.querySelector("#jobs-container");
const spinner = document.querySelector("#spinner");
let userSearch = document.querySelector("#userSearch");

// Define Variabels
let categories;
let allJobs;
let jobsByCategory;
let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
let jobsBySearch;

getAllCategories();

// Main Function To say Hello + Build the Categories options + Save in Local Storage
function sayHello() {
  jobsContainer.innerHTML = "";
  helloSection.innerHTML = `<h1>Wellcome To Our Jobs Search Service</h1>
    <p style="margin-bottom: 50px;">To use our service all what you need is a good heart, and a little mind</p>
    <hr/> <h3>Enjoy!</h3>`;
}

async function getAllCategories() {
  try {
    const response = await fetch("./API/categories.json");
    categories = await response.json();
    categories = categories.jobs;
    buildCategories(categories);
  } catch (error) {
    console.log(error);
  }
}

function buildCategories(arr) {
  arr.forEach((category) => {
    dropdownCategories.innerHTML += `
    <li><a class="dropdown-item" href="#" onclick="setPage('category')">${category.name}</a></li>
    `;
  });
}

function saveInLocalStorage() {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
}

// Functions To Build the page
async function setPage(page) {
  localStorage.setItem("page", page);
  spinner.style.display = "block";

  if (page === "allJobs") {
    console.log("The Request is sending...");
    await getAllJobs();
    spinner.style.display = "block";

    buildJobs(allJobs);
  } else if (page === "savedJobs") {
    buildJobs(savedJobs);
  } else if (page === "category") {
    await getJobsByCategory();
    spinner.style.display = "block";

    buildJobs(jobsByCategory);
  } else if (page === "search") {
    spinner.style.display = "block";

    await getJobsBySearch();

    buildJobs(jobsBySearch);
  }
}

function buildJobs(arr = allJobs) {
  helloSection.innerHTML = "";
  jobsContainer.innerHTML = "";

  arr.forEach((job) => {
    const encodedJob = encodeURIComponent(JSON.stringify(job)).replaceAll(
      "'",
      ""
    );
    const isJobSaved = savedJobs.findIndex(
      (savedJob) => savedJob.id === job.id
    );
    const removeButton = `<button type="button" onclick="deleteFromSavedJobs(${isJobSaved})" class="btn btn-danger">Remove</button>`;
    const addButton = `<button type="button" onclick="addJobToSavedJobs('${encodedJob}')"
     
     class="btn btn-danger bg-gradient m-3" >
                Save This JOB
              </button>`;

    jobsContainer.innerHTML += `
    <div class="job-section1">
    <div style="border-bottom: 1px solid grey">
            <p class="text-center bg-body-secondary p-2 m-0">Company Name: ${
              job.company_name
            }</p>
            </div>
            <img src="${job.company_logo}" alt="${
      job.company_name
    }" width="100%" height="200px"/>
            <h4 class="text-center fw-bold text-decoration-underline">${
              job.title
            }</h4>
            <p class="ms-2">Salary: ${job.salary}</p>
            <div class="scroll-box">
            ${job.description}
            </div>
            <div style="margin: 3px 0 3px 0; text-align: center;">
              ${isJobSaved !== -1 ? removeButton : addButton}
              <a href="${
                job.url
              }" target="_blank"> <button type="button" class="btn btn-success m-3">
                See This Job
              </button>
              </a>
            </div>
            <div style="border-top: 1px solid grey">
            <p class="bg-body-secondary m-0 p-2">Type: ${job.job_type}</p>
            </div>
          </div>
    `;
  });
}

// Functions To Get the jobs
async function getAllJobs() {
  try {
    const response = await fetch("./API/jobs.json");
    const data = await response.json();
    allJobs = data.jobs;
  } catch (error) {
    console.log(error);
  }
}

async function getJobsByCategory(category) {
  category = String(category).replaceAll(" ", "-");
  const url = urlJobsByCategory + category + "?jobs&limit=20";
  console.log(url);
  try {
    const response = await fetch(url);
    const data = await response.json();
    jobsByCategory = data.jobs;
    buildJobs(jobsByCategory);
  } catch (error) {
    console.log(error);
  }
}

async function getJobsBySearch() {
  const url = urlSearch + userSearch.value;
  const response = await fetch(url);
  const data = await response.json();
  jobsBySearch = data.jobs;
  console.log(url);
}

// Functions To ADD and DELETE jobs
function addJobToSavedJobs(job) {
  const savedJob = JSON.parse(decodeURIComponent(job));
  savedJobs.push(savedJob);
  saveInLocalStorage();
  setPage(localStorage.getItem("page"));
  console.log(savedJobs);
}

function deleteFromSavedJobs(index) {
  savedJobs.splice(index, 1);
  saveInLocalStorage();
  setPage(localStorage.getItem("page"));
}

