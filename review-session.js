// ป้องกันไม่ให้เข้าหน้านี้โดยไม่ Login
if (!sessionStorage.getItem("review_user")) {
  alert("❌ คุณไม่มีสิทธิ์เข้า ใช้ระบบสอบทาน");
  window.location.href = "fa-review-login.html";
}
