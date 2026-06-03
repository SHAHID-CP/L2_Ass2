import helmet from "helmet";
import cors from "cors";
import express, {type Application,type Request,type Response} from "express";
import CookieParser from "cookie-parser";

import { authRoutes } from "./modules/auth/auth.route";
import { issueRoutes } from "./modules/issues/issues.route";
import globalErrorHandler from "./middleware/globalErrorHandeler";



const app: Application = express();

app.use(helmet());
app.use(cors({origin: "http://localhost:3000",}),);
app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));




app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success:true,
    message: "Wellcome to Dev pulse Server"
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.use(globalErrorHandler);

export default app;