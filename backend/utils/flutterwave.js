const axios = require("axios");

const FLW_BASE_URL = "https://api.flutterwave.com/v3";

const flw = axios.create({

    baseURL: FLW_BASE_URL,

    headers: {

        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,

        "Content-Type": "application/json"

    }

});

class Flutterwave {

    /**
     * ==========================================
     * Initialize Payment
     * ==========================================
     */
    static async initialize(payload) {

        const response = await flw.post(
            "/payments",
            payload
        );

        return response.data;

    }

    /**
     * ==========================================
     * Verify Transaction
     * ==========================================
     */
    static async verify(transactionId) {

        const response = await flw.get(
            `/transactions/${transactionId}/verify`
        );

        return response.data;

    }

}

module.exports = Flutterwave;