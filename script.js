// ==========================================
// CloudDrive - AWS Configuration
// ==========================================

const REGION = "ap-southeast-2";

const USER_POOL_ID = "ap-southeast-2_sv0CiFdMQ";

const CLIENT_ID = "2rm2cso1d54prav244u5197tmu";

const IDENTITY_POOL_ID =
    "ap-southeast-2:40646eb6-c76e-41b7-8c74-4c45631d0615";

const BUCKET_NAME =
    "clouddrive-srikanth-2026-8515";


// ==========================================
// Cognito User Pool
// ==========================================

const poolData = {
    UserPoolId: USER_POOL_ID,
    ClientId: CLIENT_ID
};

const userPool =
    new AmazonCognitoIdentity.CognitoUserPool(poolData);


// ==========================================
// Login
// ==========================================

function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    if (!email || !password) {
        document.getElementById("authMessage").innerText =
            "Please enter email and password.";
        return;
    }

    const authenticationData = {
        Username: email,
        Password: password
    };

    const authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails(
            authenticationData
        );

    const userData = {
        Username: email,
        Pool: userPool
    };

    const cognitoUser =
        new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {

        onSuccess: function () {

            showDrive();

        },

        onFailure: function (error) {

            console.error(error);

            document.getElementById("authMessage").innerText =
                "❌ " + error.message;
        }

    });
}


// ==========================================
// Sign Up
// ==========================================

function signUp() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    if (!email || !password) {
        document.getElementById("authMessage").innerText =
            "Please enter email and password.";
        return;
    }

    userPool.signUp(
        email,
        password,
        [],
        null,

        function (error, result) {

            if (error) {

                console.error(error);

                document.getElementById("authMessage").innerText =
                    "❌ " + error.message;

                return;
            }

            document.getElementById("authMessage").innerText =
                "✅ Account created. Check your email for verification.";

        }
    );
}


// ==========================================
// Get Current Cognito User
// ==========================================

function getCurrentUser() {

    return userPool.getCurrentUser();

}


// ==========================================
// Get Cognito Session
// ==========================================

function getSession() {

    return new Promise(function (resolve, reject) {

        const user = getCurrentUser();

        if (!user) {

            reject(
                new Error("User is not logged in.")
            );

            return;
        }

        user.getSession(function (error, session) {

            if (error) {

                reject(error);
                return;

            }

            if (!session.isValid()) {

                reject(
                    new Error("Cognito session is invalid.")
                );

                return;
            }

            resolve(session);

        });

    });

}


// ==========================================
// Configure AWS Credentials
// ==========================================

async function configureAWS() {

    const session = await getSession();

    const idToken =
        session.getIdToken().getJwtToken();

    AWS.config.region = REGION;

    AWS.config.credentials =
        new AWS.CognitoIdentityCredentials({

            IdentityPoolId: IDENTITY_POOL_ID,

            Logins: {

                [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]:
                    idToken

            }

        });

    await new Promise(function (resolve, reject) {

        AWS.config.credentials.get(function (error) {

            if (error) {

                reject(error);

            } else {

                resolve();

            }

        });

    });

}


// ==========================================
// Create S3 Object
// ==========================================

function getS3() {

    return new AWS.S3({

        apiVersion: "2006-03-01",

        region: REGION

    });

}


// ==========================================
// Show CloudDrive
// ==========================================

function showDrive() {

    document.getElementById("authSection").style.display =
        "none";

    document.getElementById("driveSection").style.display =
        "block";

    const user = getCurrentUser();

    if (user) {

        document.getElementById("userEmail").innerText =
            user.getUsername();

    }

    loadFiles();

}


// ==========================================
// Load Files
// ==========================================

async function loadFiles() {

    const fileList =
        document.getElementById("fileList");

    fileList.innerHTML =
        "<p>⏳ Loading files...</p>";

    try {

        await configureAWS();

        const s3 = getS3();

        const params = {

            Bucket: BUCKET_NAME

        };

        s3.listObjectsV2(
            params,

            function (error, data) {

                if (error) {

                    console.error(error);

                    fileList.innerHTML =
                        `<p style="color:red;">
                        ❌ Could not load files: ${error.message}
                        </p>`;

                    return;
                }

                fileList.innerHTML = "";

                if (
                    !data.Contents ||
                    data.Contents.length === 0
                ) {

                    fileList.innerHTML =
                        "<p>No files uploaded yet.</p>";

                    return;

                }

                data.Contents.forEach(function (file) {

                    const div =
                        document.createElement("div");

                    div.className = "file-item";

                    div.innerHTML = `

                        <span>
                            📄 ${file.Key}
                            <small>
                                (${formatSize(file.Size)})
                            </small>
                        </span>

                        <button
                            onclick="downloadFile('${encodeURIComponent(file.Key)}')">
                            Download
                        </button>

                        <button
                            onclick="deleteFile('${encodeURIComponent(file.Key)}')">
                            Delete
                        </button>

                    `;

                    fileList.appendChild(div);

                });

            }
        );

    } catch (error) {

        console.error(error);

        fileList.innerHTML =
            `<p style="color:red;">
            ❌ Could not load files: ${error.message}
            </p>`;

    }

}


// ==========================================
// Upload File
// ==========================================

async function uploadFile() {

    const fileInput =
        document.getElementById("fileInput");

    const status =
        document.getElementById("uploadStatus");

    if (!fileInput.files.length) {

        status.innerText =
            "❌ Please choose a file first.";

        return;

    }

    const file =
        fileInput.files[0];

    status.innerText =
        "⏳ Uploading...";

    try {

        await configureAWS();

        const s3 = getS3();

        const params = {

            Bucket: BUCKET_NAME,

            Key: file.name,

            Body: file,

            ContentType:
                file.type || "application/octet-stream"

        };

        s3.putObject(
            params,

            function (error) {

                if (error) {

                    console.error(error);

                    status.innerText =
                        "❌ Upload failed: " +
                        error.message;

                    return;

                }

                status.innerText =
                    "✅ File uploaded successfully!";

                fileInput.value = "";

                loadFiles();

            }
        );

    } catch (error) {

        console.error(error);

        status.innerText =
            "❌ Upload failed: " +
            error.message;

    }

}


// ==========================================
// Download File
// ==========================================

async function downloadFile(encodedKey) {

    const key =
        decodeURIComponent(encodedKey);

    try {

        await configureAWS();

        const s3 = getS3();

        const params = {

            Bucket: BUCKET_NAME,

            Key: key,

            Expires: 300

        };

        const url =
            s3.getSignedUrl(
                "getObject",
                params
            );

        window.open(url, "_blank");

    } catch (error) {

        console.error(error);

        alert(
            "❌ Download failed: " +
            error.message
        );

    }

}


// ==========================================
// Delete File
// ==========================================

async function deleteFile(encodedKey) {

    const key =
        decodeURIComponent(encodedKey);

    const confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            key +
            "?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        await configureAWS();

        const s3 = getS3();

        const params = {

            Bucket: BUCKET_NAME,

            Key: key

        };

        s3.deleteObject(
            params,

            function (error) {

                if (error) {

                    console.error(error);

                    alert(
                        "❌ Delete failed: " +
                        error.message
                    );

                    return;

                }

                alert(
                    "✅ File deleted successfully."
                );

                loadFiles();

            }
        );

    } catch (error) {

        console.error(error);

        alert(
            "❌ Delete failed: " +
            error.message
        );

    }

}


// ==========================================
// Format File Size
// ==========================================

function formatSize(bytes) {

    if (!bytes) {
        return "0 B";
    }

    const units = [
        "B",
        "KB",
        "MB",
        "GB"
    ];

    const index =
        Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

    return (
        (bytes /
            Math.pow(1024, index)
        ).toFixed(2)
        + " "
        + units[index]
    );

}


// ==========================================
// Logout
// ==========================================

function logout() {

    const user =
        getCurrentUser();

    if (user) {

        user.signOut();

    }

    location.reload();

}


// ==========================================
// Make Functions Available to HTML
// ==========================================

window.signUp = signUp;
window.login = login;
window.logout = logout;
window.uploadFile = uploadFile;
window.loadFiles = loadFiles;
window.downloadFile = downloadFile;
window.deleteFile = deleteFile;