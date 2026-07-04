import express from "express"
import { ensure_authenticated } from "../middleware/verify_token.js"
import discipline from "../controllers/discipline.js"
import { weighted_report } from "../controllers/weighted_report.js"
import { rep_report } from "../controllers/reps_report.js"

const router = express.Router()

router.get("/generate-pdf", async (req, res) => {

   console.log("JWT User:", req.user);

   const email = req.user.email;

   console.log("Email:", email);

   const discipline_data = await discipline(email);

   console.log("Discipline Done");

   const weighted_report_data = await weighted_report(email);

   console.log("Weight Done");

   const rep_report_data = await rep_report(email);

   console.log("Reps Done");

   res.json({
      discipline: discipline_data,
      weighted_report: weighted_report_data,
      rep_report: rep_report_data
   });
});
export default router 
