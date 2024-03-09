import { config } from "dotenv";
import { Request, Response } from "express";
import { PetsdataType } from "../InterFace/interFace";
config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_API_KEY);

const checkout = async (req: Request, res: Response) => {
  try {
    const { Petdetails, fee }: { Petdetails: PetsdataType; fee: number } =
      req.body;

    if (!Petdetails || !fee) {
      return res.status(400).json({
        success: false,
        error: "Pet details and fee are required.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: Petdetails?.characteristics?.name ?? "ex",
              images: [Petdetails?.petImage[0]] ?? [
                "https://example.com/product-image.jpg",
              ],
            },
            unit_amount: fee * 100,
          },
          quantity: 1, // Add the quantity property here
        },
      ],
      mode: "payment",
      success_url: `${process.env.RequestPort}/success`,
      cancel_url: `${process.env.RequestPort}/cancel`,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while processing the checkout.",
    });
  }
};

export default checkout;
