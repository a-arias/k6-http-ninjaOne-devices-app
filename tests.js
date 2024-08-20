import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp-up to 20 users over 30 seconds
        { duration: '1m', target: 20 },  // Stay at 20 users for 1 minute
        { duration: '30s', target: 0 },  // Ramp-down to 0 users over 30 seconds
    ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
    // GET all devices
    let res = http.get(`${BASE_URL}/devices`);
    check(res, {
        'GET /devices status is 200': (r) => r.status === 200,
    });

    // POST a new device
    let createPayload = JSON.stringify({
        system_name: 'DESKTOP-ONE',
        type: 'WINDOWS',
        hdd_capacity: '92',
    });
    res = http.post(`${BASE_URL}/devices`, createPayload, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
        'POST /devices status is 200': (r) => r.status === 200,
    });

    // PUT to update a device
    const deviceId = JSON.parse(res.body).id; // Assuming the response body contains the device ID
    let updatePayload = JSON.stringify({
        system_name: 'DESKTOP-OFFICE',
        type: 'MAC',
        hdd_capacity: '500',
    });
    res = http.put(`${BASE_URL}/devices/${deviceId}`, updatePayload, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
        'PUT /devices/:id status is 200': (r) => r.status === 200,
    });

    // DELETE a device
    res = http.del(`${BASE_URL}/devices/${deviceId}`);
    check(res, {
        'DELETE /devices/:id status is 200': (r) => r.status === 200,
    });

    sleep(1); // Wait for 1 second between iterations
}