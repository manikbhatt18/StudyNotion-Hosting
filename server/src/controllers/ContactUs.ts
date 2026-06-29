import { contactUsEmail } from "../mail/templates/contactFormRes";
import mailSender from "../utils/mailSender";
import { Request, Response } from "express";

export const contactUsController = async (req: Request, res: Response): Promise<void | Response> => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
  console.log(req.body);
  try {
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    console.log("Email Res ", emailRes);
    return res.json({
      success: true,
      message: "Email send successfully",
    });
  } catch (error: any) {
    console.log("Error", error);
    console.log("Error message :", error.message);
    return res.json({
      success: false,
      message: "Something went wrong...",
    });
  }
};
