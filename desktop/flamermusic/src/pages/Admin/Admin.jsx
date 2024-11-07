import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../../styles/administrator.css';
import '../../styles/index.css';

const API_URL = "https://localhost:7219/";

const Admin = () => {
    return (
        <div className="main">
            <div className="right-section">
                <div className="menu">
                    <nav>
                        <ul>
                            <li id="backBtn">
                                <Link to="/main_window">
                                    <img src={require("../../../public/assets/icons/return.png")} alt="Return" />
                                </Link>
                            </li>
                            <li id="editingAccounts">
                                <Link to="/admin/edit-accounts">
                                    <img src={require("../../../public/assets/icons/edit-users.png")} alt="Edit Accounts" />
                                </Link>
                            </li>
                            <li id="requestProccessing">
                                <Link to="/admin/review-requests">
                                    <img src={require("../../../public/assets/icons/settings-icon.png")} alt="Review requests" />
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div id="displayField" className="displayField">
                <Outlet />
            </div>
        </div>
    );
};

export default Admin;
