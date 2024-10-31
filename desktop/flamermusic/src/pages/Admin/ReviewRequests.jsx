import React, { useEffect, useState } from 'react';
import { getRequests, confirmRequest, cancelRequest } from '../../services/adminService.jsx';

const ReviewRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const fetchedRequests = await getRequests();
                console.log(fetchedRequests);
                setRequests(fetchedRequests || []);
            } catch (error) {
                console.error('An error occurred while fetching requests:', error);
            }
        };

        loadRequests();
    }, []);

    const handleConfirm = async (request) => {
        await confirmRequest(request);
        setRequests((prevRequests) => prevRequests.filter(r => r.id !== request.id));
    };

    const handleCancel = async (request) => {
        await cancelRequest(request);
        setRequests((prevRequests) => prevRequests.filter(r => r.id !== request.id));
    };

    return (
        <div className="requests-list">
            <h2>Review Requests</h2>
            <div className="requests-div">
                {requests.length === 0 ? (
                    <div>Немає запитів</div>
                ) : (
                    requests.map((request) => (
                        <div key={request.id} className="request">
                            <div>Користувач: {request.userUsername}</div>
                            <div>Коментар: {request.description}</div>
                            <button onClick={() => handleConfirm(request)}>Прийняти</button>
                            <button onClick={() => handleCancel(request)}>Відхилити</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewRequests;
