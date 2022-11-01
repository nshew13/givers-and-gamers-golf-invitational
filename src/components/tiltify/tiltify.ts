import SECRETS from "./secrets.json";
import type { TiltifyDonationProgress } from "./types";

export class Tiltify {
    private static readonly _CAUSE_ID = "7886";

    private static readonly _REQUIRED_HEADERS = new Headers({
        "Content-Type": "text/json",
        Authorization: `Bearer ${SECRETS.API_KEY}`,
    });

    private static readonly _API_URL = "https://tiltify.com/api/v3";

    public static getCurrentDonationProgress(): Promise<TiltifyDonationProgress> {
        return fetch(
            `${Tiltify._API_URL}/causes/${Tiltify._CAUSE_ID}/fundraising-events`,
            {
                method: "GET",
                headers: Tiltify._REQUIRED_HEADERS,
            }
        ).then((response) => {
            if (response.ok) {
                return Promise.resolve(
                    response.json().then((json) => ({
                        current: json.data[0].totalAmountRaised,
                        goal: json.data[0].fundraiserGoalAmount,
                    }))
                );
            } else {
                return Promise.reject("Response failed");
            }
        });
    }
}
