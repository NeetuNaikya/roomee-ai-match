// DigiLocker Aadhaar Verification Controller
import axios from 'axios';

const DIGILOCKER_CLIENT_ID = process.env.DIGILOCKER_CLIENT_ID;
const DIGILOCKER_CLIENT_SECRET = process.env.DIGILOCKER_CLIENT_SECRET;
const DIGILOCKER_REDIRECT_URI = process.env.DIGILOCKER_REDIRECT_URI;

export const getAuthUrl = (req, res) => {
    // Step 1: Redirect user to DigiLocker OAuth2 URL
    const url = `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=${DIGILOCKER_CLIENT_ID}&redirect_uri=${DIGILOCKER_REDIRECT_URI}&scope=aadhaar`;
    res.json({ url });
};

export const handleCallback = async(req, res) => {
    // Step 2: Exchange code for access token
    const { code } = req.query;
    try {
        const tokenRes = await axios.post('https://digilocker.meripehchaan.gov.in/public/oauth2/1/token', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                client_id: DIGILOCKER_CLIENT_ID,
                client_secret: DIGILOCKER_CLIENT_SECRET,
                redirect_uri: DIGILOCKER_REDIRECT_URI
            }
        });
        const accessToken = tokenRes.data.access_token;
        // Step 3: Fetch Aadhaar profile
        const aadhaarRes = await axios.get('https://digilocker.meripehchaan.gov.in/public/oauth2/1/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        // Save Aadhaar details to user profile (implement as needed)
        res.json({ aadhaar: aadhaarRes.data });
    } catch (err) {
        res.status(500).json({ error: 'DigiLocker verification failed', details: err.message });
    }
};