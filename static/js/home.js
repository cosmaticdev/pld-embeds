// Elements
const preview = document.getElementById("preview");
const generatedLink = document.getElementById("generatedLink");
const showAllTimeMax = document.getElementById("showAllTimeMax");
const showMostRecent = document.getElementById("showMostRecent");

// Update preview
function updatePreview() {
    const rounded = document.getElementById("rounded").checked;
    const borderColor = document.getElementById("borderColor").value;
    const bgColor = document.getElementById("bgColor").value;
    const borderWidth = document.getElementById("borderWidth").value;
    const textSize = document.getElementById("textSize").value;
    const textFont = document.getElementById("textFont").value;
    const hPadding = document.getElementById("hPadding").value;
    const vPadding = document.getElementById("vPadding").value;
    const showAllTimeMax = document.getElementById("showAllTimeMax").checked;
    const showMostRecent = document.getElementById("showMostRecent").checked;
    const showUsername = document.getElementById("showUsername").value;

    const robloxID = document.getElementById("robloxID").value;



    // Set preview text based on selected options
    let previewText = "";
    if (showAllTimeMax) previewText += "<maximum>";
    if (showAllTimeMax && showMostRecent) previewText += " from " + `<${showUsername}>` + " | ";
    if (showMostRecent) previewText += "<recent>";
    if ((showAllTimeMax || showMostRecent) && showUsername) previewText += " from ";
    if (showUsername) previewText += `<${showUsername}>`;
    preview.innerText = previewText || "Preview Text";

    // Apply styles to preview
    preview.style.borderRadius = rounded ? "12px" : "0px";
    preview.style.border = `${borderWidth}px solid ${borderColor}`;
    preview.style.backgroundColor = bgColor;
    preview.style.fontSize = `${textSize}px`;
    preview.style.fontFamily = textFont;
    preview.style.padding = `${vPadding}px ${hPadding}px`;

    // Generate URL
    const params = new URLSearchParams({
        robloxID,
        rounded,
        borderColor,
        bgColor,
        borderWidth,
        textSize,
        textFont,
        hPadding,
        vPadding,
        showAllTimeMax,
        showMostRecent,
        showUsername
    });
    generatedLink.value = window.location.origin + `/widget?${params.toString()}`;
}

// Copy link to clipboard
function copyLink() {
    generatedLink.select();
    document.execCommand("copy");
    alert("Link copied!");
}

// Add event listeners for all inputs
document.querySelectorAll("input, select").forEach(el => el.addEventListener("input", updatePreview));

// Initial preview update
updatePreview();