let currentRepo = {
    owner: 'dexmate-ai',
    name: 'vega-firmware'
};

function showMessage(message, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.className = type;
    messageEl.textContent = message;
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = '';
    }, 5000);
}

function formatBytes(bytes) {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

async function loadFirmwares() {
    const loading = document.getElementById('loading');
    const firmwareList = document.getElementById('firmwareList');
    
    // Get repository configuration
    const repoOwner = document.getElementById('repoOwner').value.trim();
    const repoName = document.getElementById('repoName').value.trim();
    
    if (!repoOwner || !repoName) {
        showMessage('Please enter both repository owner and name', 'error');
        return;
    }
    
    currentRepo = { owner: repoOwner, name: repoName };
    loading.style.display = 'block';
    firmwareList.innerHTML = '';
    
    try {
        // Fetch releases from GitHub API
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`);
        
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }
        
        const releases = await response.json();
        
        loading.style.display = 'none';
        
        if (!Array.isArray(releases) || releases.length === 0) {
            firmwareList.innerHTML = '<div class="no-firmware">No firmware versions available in this repository</div>';
            return;
        }
        
        // Process releases and build firmware cards
        const firmwareCards = await Promise.all(releases.map(async (release, index) => {
            const version = release.tag_name.replace(/^v/, '');
            
            // Find firmware and metadata assets
            let firmwareAsset = null;
            let metadataAsset = null;
            
            for (const asset of release.assets || []) {
                if (asset.name.endsWith('.dexmate')) {
                    firmwareAsset = asset;
                } else if (asset.name.startsWith('metadata_')) {
                    metadataAsset = asset;
                }
            }
            
            if (!firmwareAsset) {
                return null; // Skip releases without firmware
            }
            
            let packageInfo = null;
            
            // Try to fetch metadata
            if (metadataAsset) {
                try {
                    const metaResponse = await fetch(metadataAsset.browser_download_url);
                    if (metaResponse.ok) {
                        const metadata = await metaResponse.json();
                        packageInfo = metadata.package_info;
                    }
                } catch (e) {
                    console.warn('Failed to fetch metadata for', version, e);
                }
            }
            
            const supportedRobots = packageInfo?.supported_robots || [];
            
            return `
                <div class="firmware-card">
                    <div class="firmware-header">
                        <div>
                            <span class="version-badge">v${version}</span>
                            ${index === 0 ? '<span class="latest-badge">LATEST</span>' : ''}
                            ${supportedRobots.length > 0 ? supportedRobots.map(robot => 
                                `<span class="robot-badge">${robot}</span>`
                            ).join('') : ''}
                        </div>
                        <span class="upload-time">${formatDate(release.published_at)}</span>
                    </div>
                    
                    ${packageInfo ? `
                        <div class="package-meta">
                            <div class="meta-item">Package: v${packageInfo.package_version || 'Unknown'}</div>
                            <div class="meta-item">Build: ${formatDate(packageInfo.created_at) || 'Unknown'}</div>
                        </div>
                    ` : ''}
                    
                    <div class="changelog-container">
                        <div class="changelog-header">
                            <span class="changelog-title">Changelog</span>
                        </div>
                        <div class="changelog">
                            ${marked.parse(release.body || 'No changelog available')}
                        </div>
                    </div>
                    
                    <div class="file-info">
                        <span>${firmwareAsset.name}</span>
                        <span>${formatBytes(firmwareAsset.size)}</span>
                        <span>${firmwareAsset.download_count} downloads</span>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <a href="${firmwareAsset.browser_download_url}" class="download-btn" download>Download Firmware</a>
                    </div>
                </div>
            `;
        }));
        
        // Filter out null entries and display
        const validCards = firmwareCards.filter(card => card !== null);
        
        if (validCards.length === 0) {
            firmwareList.innerHTML = '<div class="no-firmware">No firmware files found in releases</div>';
        } else {
            firmwareList.innerHTML = validCards.join('');
        }
        
    } catch (error) {
        loading.style.display = 'none';
        
        if (error.message.includes('404')) {
            firmwareList.innerHTML = '<div class="error">Repository not found. Please check the owner and repository name.</div>';
        } else if (error.message.includes('403')) {
            firmwareList.innerHTML = '<div class="error">API rate limit exceeded. Please try again later.</div>';
        } else {
            firmwareList.innerHTML = '<div class="error">Failed to load firmwares: ' + error.message + '</div>';
        }
    }
}


// Load firmwares on page load
window.addEventListener('DOMContentLoaded', () => {
    // Check if repository info is in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const owner = urlParams.get('owner');
    const repo = urlParams.get('repo');
    
    if (owner && repo) {
        document.getElementById('repoOwner').value = owner;
        document.getElementById('repoName').value = repo;
        currentRepo = { owner, name: repo };
    }
    
    // Always load firmwares automatically
    loadFirmwares();
    
    // Add keyboard shortcut to show config (Ctrl+Shift+C for debugging)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            const configSection = document.getElementById('configSection');
            configSection.style.display = configSection.style.display === 'none' ? 'block' : 'none';
        }
    });
});