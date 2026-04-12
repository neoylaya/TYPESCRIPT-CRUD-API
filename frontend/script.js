const STORAGE_KEY = "ipt_demo_v1";
let currentUser = null;

window.db = {
  accounts:    [],
  departments: [],
  employees:   [],
  requests:    []
};

/* ========================
   STORAGE
======================== */

function loadFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) throw "empty";
    window.db = {
      accounts:    saved.accounts    || [],
      departments: saved.departments || [],
      employees:   saved.employees   || [],
      requests:    saved.requests    || []
    };
  } catch {
    window.db = {
      accounts: [{
        firstName: "Admin",
        lastName:  "User",
        email:     "admin@example.com",
        password:  "Password123!",
        role:      "admin",
        verified:  true
      }],
      departments: [
        { id: "dept-1", name: "Engineering", desc: "Software and hardware engineering" },
        { id: "dept-2", name: "HR",          desc: "Human Resources" }
      ],
      employees: [],
      requests:  []
    };
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.db));
}

/* ========================
   TOAST (Phase 8)
======================== */

function showToast(message, type = "success") {
  const toastEl = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");

  toastEl.className = `toast align-items-center text-white border-0 bg-${type}`;
  toastMsg.innerText = message;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

/* ========================
   ROUTING
======================== */

const privatePages = ["#/profile", "#/requests"];
const adminPages = ["#/accounts", "#/departments", "#/employees", "#/admin-requests"];

function navigateTo(hash) {
  window.location.hash = hash;
}

function handleRouting() {
  const hash = window.location.hash || "#/";

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  if (privatePages.includes(hash) && !currentUser) return navigateTo("#/login");
  if (adminPages.includes(hash)) {
    if (!currentUser) return navigateTo("#/login");
    if (currentUser.role !== "admin") return navigateTo("#/");
  }

  switch (hash) {
    case "#/register":
      showPage("register-page");
      break;
    case "#/login":
      showPage("login-page");
      const justVerified = localStorage.getItem("just_verified");
      if (justVerified) {
        document.getElementById("verified-alert").style.display = "block";
        localStorage.removeItem("just_verified");
      } else {
        document.getElementById("verified-alert").style.display = "none";
      }
      break;
    case "#/verify-email":
      showPage("verify-email-page");
      document.getElementById("verify-email-text").innerText =
        localStorage.getItem("unverified_email") || "";
      break;
    case "#/profile":
      showPage("profile-page");
      renderProfile();
      break;
    case "#/accounts":
      showPage("accounts-page");
      renderAccountsList();
      break;
    case "#/departments":
      showPage("departments-page");
      renderDepartmentsList();
      break;
    case "#/employees":
      showPage("employees-page");
      renderEmployeesTable();
      break;
    case "#/requests":
      showPage("requests-page");
      renderRequestsList();
      resetReqForm();
      break;

    case "#/admin-requests":
        showPage("admin-requests-page");
        renderAdminRequests();
        resetReqForm();
        break;
    default:
      showPage("home-page");
      
  }
}

function showPage(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

window.addEventListener("hashchange", handleRouting);

/* ========================
   AUTH STATE
======================== */

function setAuthState(isAuth, user = null) {
  const body = document.body;
  if (isAuth) {
    currentUser = user;
    body.classList.remove("not-authenticated");
    body.classList.add("authenticated");
    if (user.role === "admin") {
      body.classList.add("is-admin");
      document.getElementById("nav-username").innerText = "Admin";
    } else {
      body.classList.remove("is-admin");
      document.getElementById("nav-username").innerText = user.firstName;
    }
  } else {
    currentUser = null;
    body.classList.remove("authenticated", "is-admin");
    body.classList.add("not-authenticated");
  }
}

function logout() {
  localStorage.removeItem("auth_token");
  setAuthState(false);
  showToast("Logged out successfully.", "secondary");
  navigateTo("#/");
}

/* ========================
   REGISTER
======================== */

document.getElementById("reg-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const err = document.getElementById("reg-error");
  const pw  = document.getElementById("reg-pw").value;

  const body = {
    title:           "Mr",
    firstName:       document.getElementById("reg-first").value.trim(),
    lastName:        document.getElementById("reg-last").value.trim(),
    email:           document.getElementById("reg-email").value.trim(),
    password:        pw,
    confirmPassword: pw,
    role:            "User"
  };

  try {
    const res  = await fetch("/users", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("unverified_email", body.email);
    showToast("Account created! Please verify your email.");
    navigateTo("#/verify-email");
  } catch (err2) {
    err.innerText = err2.message;
  }
});

/* ========================
   VERIFY
======================== */

function fakeVerify() {
  localStorage.setItem("just_verified", "1");
  navigateTo("#/login");
}

/* ========================
   LOGIN
======================== */

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const pw    = document.getElementById("login-pw").value;
  const err   = document.getElementById("login-error");

  try {
    const res  = await fetch("/users/authenticate", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password: pw })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("auth_user", JSON.stringify(data));
    setAuthState(true, { ...data, role: data.role.toLowerCase() });
    showToast(`Welcome back, ${data.firstName}!`);
    navigateTo("#/profile");
  } catch (e) {
    err.innerText = e.message; // shows "Wrong password" or "Email not found"
  }
});

/* ========================
   PROFILE
======================== */

function renderProfile() {
  document.getElementById("profile-info").innerHTML = `
    <table class="table table-borderless mb-0">
      <tr><td class="text-muted" style="width:100px">Name</td><td>${currentUser.firstName} ${currentUser.lastName}</td></tr>
      <tr><td class="text-muted">Email</td><td>${currentUser.email}</td></tr>
      <tr><td class="text-muted">Role</td><td>
        <span class="badge ${currentUser.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${currentUser.role}</span>
      </td></tr>
    </table>
  `;
}

function openEditProfile() {
  document.getElementById("edit-profile-form").style.display = "block";
  document.getElementById("edit-first").value = currentUser.firstName;
  document.getElementById("edit-last").value  = currentUser.lastName;
  document.getElementById("edit-email").value = currentUser.email;
  document.getElementById("edit-profile-error").innerText = "";
}

function closeEditProfile() {
  document.getElementById("edit-profile-form").style.display = "none";
}

document.getElementById("edit-profile-el").addEventListener("submit", async function (e) {
  e.preventDefault();

  const first = document.getElementById("edit-first").value.trim();
  const last  = document.getElementById("edit-last").value.trim();
  const email = document.getElementById("edit-email").value.trim();
  const err   = document.getElementById("edit-profile-error");

  try {
    const res = await fetch(`/users/${currentUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: first,
        lastName: last,
        email: email
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // ✅ Update frontend state
    currentUser.firstName = first;
    currentUser.lastName  = last;
    currentUser.email     = email;

    localStorage.setItem("auth_user", JSON.stringify(currentUser));

    renderProfile();
    closeEditProfile();

    showToast("Profile updated!");

  } catch (e) {
    err.innerText = e.message;
  }
});

/* ========================
   ACCOUNTS
======================== */

async function renderAccountsList() {
  try {
    const res   = await fetch("/users");
    const users = await res.json();
    const tbody = document.getElementById("acc-list");
    tbody.innerHTML = "";
    users.forEach((u) => {
      tbody.innerHTML += `
        <tr>
          <td>${u.firstName} ${u.lastName}</td>
          <td>${u.email}</td>
          <td><span class="badge ${u.role === 'Admin' ? 'bg-danger' : 'bg-secondary'}">${u.role}</span></td>
          <td>✅</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editAcc(${u.id})">Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteAcc(${u.id})">Delete</button>
          </td>
        </tr>`;
    });
  } catch (e) {
    showToast("Failed to load accounts.", "danger");
  }
}

function openAccForm(data = null, idx = -1) {
  document.getElementById("acc-form").style.display = "block";
  document.getElementById("acc-form-title").innerText = idx >= 0 ? "Edit Account" : "Add Account";
  document.getElementById("acc-idx").value        = idx;
  document.getElementById("acc-first").value      = data?.firstName || "";
  document.getElementById("acc-last").value       = data?.lastName  || "";
  document.getElementById("acc-email").value      = data?.email     || "";
  document.getElementById("acc-pw").value         = "";
  document.getElementById("acc-role").value       = data?.role      || "User";
  document.getElementById("acc-verified").checked = data?.verified  || false;
  document.getElementById("acc-error").innerText  = "";

  const pwField = document.getElementById("acc-pw");
  if (idx >= 0) {
    pwField.removeAttribute("required");
    pwField.placeholder = "New password (leave blank to keep)";
  } else {
    pwField.setAttribute("required", "");
    pwField.placeholder = "Password (min 6)";
  }
}

function closeAccForm() {
  document.getElementById("acc-form").style.display = "none";
}

document.getElementById("acc-form-el").addEventListener("submit", async function (e) {
  e.preventDefault();

  const idx = document.getElementById("acc-idx").value;
  const err = document.getElementById("acc-error");

  const body = {
    firstName: document.getElementById("acc-first").value.trim(),
    lastName:  document.getElementById("acc-last").value.trim(),
    email:     document.getElementById("acc-email").value.trim(),
    role:      document.getElementById("acc-role").value,
  };

  const pw = document.getElementById("acc-pw").value;
  if (pw) {
    if (pw.length < 6) { err.innerText = "Password must be at least 6 chars."; return; }
    body.password        = pw;
    body.confirmPassword = pw;
  }

  try {
    // Edit existing
    if (editingAccId) {
      const res  = await fetch(`/users/${editingAccId}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("Account updated.");
    } else {
      // Add new — use register endpoint
      body.title           = "Mr";
      body.password        = pw;
      body.confirmPassword = pw;
      const res  = await fetch("/users", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("Account created.");
    }
    editingAccId = null;
    closeAccForm();
    renderAccountsList();
  } catch (e) {
    err.innerText = e.message;
  }
});

let editingAccId = null;

async function editAcc(id) {
  editingAccId = id;
  try {
    const res  = await fetch(`/users/${id}`);
    const user = await res.json();
    openAccForm(user, id);
  } catch (e) {
    showToast("Failed to load user.", "danger");
  }
}

function resetPw(i) {
  const pw = prompt("New password (min 6 chars):");
  if (pw === null) return;
  if (pw.length < 6) { alert("Too short."); return; }
  window.db.accounts[i].password = pw;
  saveToStorage();
  showToast("Password updated.");
}

async function deleteAcc(id) {
  if (!confirm("Delete this account?")) return;
  try {
    await fetch(`/users/${id}`, { method: "DELETE" });
    showToast("Account deleted.", "danger");
    renderAccountsList();
  } catch (e) {
    showToast("Failed to delete.", "danger");
  }
}

/* ========================
   DEPARTMENTS
======================== */

function renderDepartmentsList() {
  const tbody = document.getElementById("dept-list");
  tbody.innerHTML = "";
  window.db.departments.forEach((d, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${d.name}</td>
        <td>${d.desc || "—"}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editDept(${i})">Edit</button>
          <button class="btn btn-sm btn-outline-danger"       onclick="deleteDept(${i})">Delete</button>
        </td>
      </tr>`;
  });
}

function openDeptForm(data = null, idx = -1) {
  document.getElementById("dept-form").style.display = "block";
  document.getElementById("dept-form-title").innerText = idx >= 0 ? "Edit Department" : "Add Department";
  document.getElementById("dept-idx").value  = idx;
  document.getElementById("dept-name").value = data?.name || "";
  document.getElementById("dept-desc").value = data?.desc || "";
}

function closeDeptForm() {
  document.getElementById("dept-form").style.display = "none";
}

document.getElementById("dept-form-el").addEventListener("submit", function (e) {
  e.preventDefault();

  const idx  = parseInt(document.getElementById("dept-idx").value);
  const name = document.getElementById("dept-name").value.trim();
  const desc = document.getElementById("dept-desc").value.trim();

  if (idx >= 0) {
    Object.assign(window.db.departments[idx], { name, desc });
  } else {
    window.db.departments.push({ id: "dept-" + Date.now(), name, desc });
  }

  saveToStorage();
  closeDeptForm();
  renderDepartmentsList();
  showToast("Department saved.");
});

function editDept(i)   { openDeptForm(window.db.departments[i], i); }

function deleteDept(i) {
  if (!confirm(`Delete "${window.db.departments[i].name}"?`)) return;
  window.db.departments.splice(i, 1);
  saveToStorage();
  renderDepartmentsList();
  showToast("Department deleted.", "danger");
}

/* ========================
   ADMIN REQUESTS
======================== */

function renderAdminRequests() {
  const tbody = document.getElementById("admin-req-list");
  tbody.innerHTML = "";

  if (!window.db.requests.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No requests yet.</td></tr>`;
    return;
  }

  window.db.requests.forEach((r, i) => {
    const color   = r.status === "Approved" ? "bg-success"
                  : r.status === "Rejected" ? "bg-danger"
                  : "bg-warning text-dark";
    const summary = r.items.map(i => `${i.name} (×${i.qty})`).join(", ");

    tbody.innerHTML += `
      <tr>
        <td>${r.date}</td>
        <td><small>${r.employeeEmail}</small></td>
        <td>${r.type}</td>
        <td><small>${summary}</small></td>
        <td><span class="badge ${color}">${r.status}</span></td>
        <td>
          ${r.status === "Pending" ? `
            <button class="btn btn-sm btn-success me-1" onclick="approveReq(${i})">✅ Approve</button>
            <button class="btn btn-sm btn-danger"       onclick="rejectReq(${i})">❌ Reject</button>
          ` : `<span class="text-muted">—</span>`}
        </td>
      </tr>`;
  });
}

function approveReq(i) {
  window.db.requests[i].status = "Approved";
  saveToStorage();
  renderAdminRequests();
  showToast("Request approved!", "success");
}

function rejectReq(i) {
  window.db.requests[i].status = "Rejected";
  saveToStorage();
  renderAdminRequests();
  showToast("Request rejected.", "danger");
}

/* ========================
   EMPLOYEES
======================== */

function renderEmployeesTable() {
  const tbody = document.getElementById("emp-list");
  tbody.innerHTML = "";
  window.db.employees.forEach((emp, i) => {
    const dept = window.db.departments.find(d => d.id === emp.deptId);
    tbody.innerHTML += `
      <tr>
        <td>${emp.empId}</td>
        <td>${emp.email}</td>
        <td>${emp.position}</td>
        <td>${dept ? dept.name : "—"}</td>
        <td>${emp.hireDate || "—"}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editEmp(${i})">Edit</button>
          <button class="btn btn-sm btn-outline-danger"       onclick="deleteEmp(${i})">Delete</button>
        </td>
      </tr>`;
  });
}

function fillDeptDropdown(selected = "") {
  const sel = document.getElementById("emp-dept");
  sel.innerHTML = `<option value="">Select Department</option>`;
  window.db.departments.forEach(d => {
    sel.innerHTML += `<option value="${d.id}" ${d.id === selected ? "selected" : ""}>${d.name}</option>`;
  });
}

function openEmpForm(data = null, idx = -1) {
  document.getElementById("emp-form").style.display = "block";
  document.getElementById("emp-form-title").innerText = idx >= 0 ? "Edit Employee" : "Add Employee";
  document.getElementById("emp-idx").value       = idx;
  document.getElementById("emp-id").value        = data?.empId    || "";
  document.getElementById("emp-email").value     = data?.email    || "";
  document.getElementById("emp-position").value  = data?.position || "";
  document.getElementById("emp-hire").value      = data?.hireDate || "";
  document.getElementById("emp-error").innerText = "";
  fillDeptDropdown(data?.deptId || "");
}

function closeEmpForm() {
  document.getElementById("emp-form").style.display = "none";
}

document.getElementById("emp-form-el").addEventListener("submit", async function (e) {
  e.preventDefault();

  const idx      = parseInt(document.getElementById("emp-idx").value);
  const empId    = document.getElementById("emp-id").value.trim();
  const email    = document.getElementById("emp-email").value.trim();
  const position = document.getElementById("emp-position").value.trim();
  const deptId   = document.getElementById("emp-dept").value;
  const hireDate = document.getElementById("emp-hire").value;
  const err      = document.getElementById("emp-error");

  // ✅ Check against backend instead of localStorage
  try {
    const res   = await fetch("/users");
    const users = await res.json();
    const found = users.find(u => u.email === email);
    if (!found) { err.innerText = "No account with that email."; return; }
  } catch (e) {
    err.innerText = "Could not verify email. Try again.";
    return;
  }

  if (!deptId) { err.innerText = "Pick a department."; return; }

  const entry = { empId, email, position, deptId, hireDate };

  if (idx >= 0) {
    Object.assign(window.db.employees[idx], entry);
  } else {
    window.db.employees.push(entry);
  }

  saveToStorage();
  closeEmpForm();
  renderEmployeesTable();
  showToast("Employee saved.");
});

function editEmp(i)   { openEmpForm(window.db.employees[i], i); }

function deleteEmp(i) {
  if (!confirm("Remove this employee?")) return;
  window.db.employees.splice(i, 1);
  saveToStorage();
  renderEmployeesTable();
  showToast("Employee removed.", "danger");
}

/* ========================
   REQUESTS
======================== */

function resetReqForm() {
  document.getElementById("req-items").innerHTML = "";
  document.getElementById("req-error").innerText = "";
  addItem();
}

function addItem() {
  const row = document.createElement("div");
  row.className = "d-flex gap-2 mb-2 item-row";
  row.innerHTML = `
    <input type="text"   class="form-control" placeholder="Item name" />
    <input type="number" class="form-control" style="max-width:100px" placeholder="Qty" min="1" value="1" />
    <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.closest('.item-row').remove()">×</button>
  `;
  document.getElementById("req-items").appendChild(row);
}

function submitReq() {
  const type = document.getElementById("req-type").value;
  const err  = document.getElementById("req-error");
  const rows = document.querySelectorAll(".item-row");

  const items = [];
  rows.forEach(row => {
    const [nameEl, qtyEl] = row.querySelectorAll("input");
    const name = nameEl.value.trim();
    if (name) items.push({ name, qty: qtyEl.value });
  });

  if (!items.length) { err.innerText = "Add at least one item."; return; }
  err.innerText = "";

  window.db.requests.push({
    id:            "req-" + Date.now(),
    type,
    items,
    status:        "Pending",
    date:          new Date().toLocaleDateString(),
    employeeEmail: currentUser.email
  });

  saveToStorage();
  bootstrap.Modal.getInstance(document.getElementById("req-popup")).hide();

 renderRequestsList(); // always render the same page

  resetReqForm();
  showToast("Request submitted!");
}

function renderRequestsList() {
  const tbody   = document.getElementById("req-list");
  const isAdmin = currentUser && currentUser.role === "admin";

  // ✅ Update page title
  const pageTitle = document.querySelector("#requests-page h3");
  if (pageTitle) pageTitle.innerText = isAdmin ? "All Requests" : "My Requests";

  // ✅ Update table headers
  const thead = document.getElementById("req-thead");
  if (thead) {
    thead.innerHTML = isAdmin
      ? "<th>Employee</th><th>Date</th><th>Type</th><th>Items</th><th>Status</th><th>Actions</th>"
      : "<th>Date</th><th>Type</th><th>Items</th><th>Status</th><th>Actions</th>";
  }

  // ✅ Admin sees all, user sees only their own
  const list = isAdmin
    ? window.db.requests
    : window.db.requests.filter(r => r.employeeEmail === currentUser.email);

  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="${isAdmin ? 6 : 4}" class="text-center text-muted py-4">No requests yet.</td></tr>`;
    return;
  }

  list.forEach((r, idx) => {
    const realIdx = window.db.requests.indexOf(r);
    const color   = r.status === "Approved" ? "bg-success"
                  : r.status === "Rejected" ? "bg-danger"
                  : "bg-warning text-dark";
    const summary = r.items.map(i => `${i.name} (×${i.qty})`).join(", ");

    const adminActions = r.status === "Pending"
        ? `<button class="btn btn-sm btn-success me-1" onclick="approveReq(${realIdx})">✅ Approve</button>
            <button class="btn btn-sm btn-danger" onclick="rejectReq(${realIdx})">❌ Reject</button>`
        : `<button class="btn btn-sm btn-outline-danger" onclick="deleteReq(${realIdx})">🗑 Delete</button>`;

    const userActions = `<button class="btn btn-sm btn-outline-danger" onclick="deleteReq(${realIdx})">🗑 Delete</button>`;
    tbody.innerHTML += `
      <tr>
        ${isAdmin ? `<td><small>${r.employeeEmail}</small></td>` : ""}
        <td>${r.date}</td>
        <td>${r.type}</td>
        <td><small>${summary}</small></td>
        <td><span class="badge ${color}">${r.status}</span></td>
        <td>${isAdmin ? adminActions : userActions}</td>
      </tr>`;
  });
}

function approveReq(idx) {
  window.db.requests[idx].status = "Approved";
  saveToStorage();

  renderRequestsList(); // ✅ ALWAYS refresh the visible table

  showToast("Request approved.", "success");
}

function rejectReq(idx) {
  window.db.requests[idx].status = "Rejected";
  saveToStorage();

  renderRequestsList(); // ✅ ALWAYS refresh

  showToast("Request rejected.", "danger");
}

function deleteReq(idx) {
  if (!confirm("Delete this request?")) return;
  window.db.requests.splice(idx, 1);
  saveToStorage();
  renderRequestsList();
  showToast("Request deleted.", "danger");
}

/* ========================
   INIT
======================== */

loadFromStorage();

// Restore session on page reload
const savedUser = JSON.parse(localStorage.getItem("auth_user"));
if (savedUser) {
  setAuthState(true, savedUser);
}

handleRouting();