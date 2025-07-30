document.addEventListener('DOMContentLoaded', () => {
    const searchResultsList = document.getElementById('search-results-list');
    const searchResultsTitle = document.getElementById('search-results-title');
    const searchTitleHead = document.getElementById('search-title-head');
    const searchInputField = document.getElementById('search-input-field');
    
    const API_SEARCH = 'https://otruyenapi.com/v1/api/tim-kiem';
    const CDN_IMAGE_DOMAIN = 'https://img.otruyenapi.com'; 

    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');

    if (keyword) {
        searchResultsTitle.textContent = `Kết quả tìm kiếm cho: "${keyword}"`;
        searchTitleHead.textContent = `Tìm kiếm: ${keyword}`;
        searchInputField.value = keyword; // Điền sẵn từ khóa vào ô tìm kiếm
        fetchSearchResults(keyword);
    } else {
        searchResultsTitle.textContent = 'Vui lòng nhập từ khóa để tìm kiếm.';
        searchResultsList.innerHTML = ''; // Xóa thông báo tải nếu không có từ khóa
    }

    async function fetchSearchResults(keyword) {
        try {
            const response = await fetch(`${API_SEARCH}?keyword=${encodeURIComponent(keyword)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displaySearchResults(data.data.items);
        } catch (error) {
            console.error('Lỗi khi tải kết quả tìm kiếm:', error);
            searchResultsList.innerHTML = '<p class="error">Không thể tải kết quả tìm kiếm. Vui lòng thử lại sau.</p>';
        }
    }

    function displaySearchResults(comics) {
        searchResultsList.innerHTML = ''; // Xóa thông báo tải

        if (!comics || comics.length === 0) {
            searchResultsList.innerHTML = '<p class="no-results">Không tìm thấy truyện nào phù hợp.</p>';
            return;
        }

        const comicGrid = document.createElement('div');
        comicGrid.classList.add('comic-list'); // Sử dụng lại style .comic-list từ index.html

        comics.forEach(comic => {
            const comicItem = document.createElement('div');
            comicItem.classList.add('comic-item');

            const comicLink = document.createElement('a');
            comicLink.href = `comic-detail.html?slug=${comic.slug}`;

            // Tạo wrapper cho ảnh
            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add('image-wrapper');
            const img = document.createElement('img');
            img.src = `${CDN_IMAGE_DOMAIN}/uploads/comics/${comic.thumb_url}`;
            img.alt = comic.name;
            imageWrapper.appendChild(img);

            // Tạo wrapper cho thông tin text
            const comicInfoText = document.createElement('div');
            comicInfoText.classList.add('comic-info-text');

            const name = document.createElement('h3');
            name.textContent = comic.name;

            const latestChapter = document.createElement('p');
            // API tìm kiếm không trả về chaptersLatest, nên chúng ta sẽ hiển thị placeholder
            latestChapter.textContent = 'Chương: Đang cập nhật'; 
            latestChapter.style.fontStyle = 'italic';
            latestChapter.style.color = '#999';
            
            comicInfoText.appendChild(name);
            comicInfoText.appendChild(latestChapter);

            comicLink.appendChild(imageWrapper);
            comicLink.appendChild(comicInfoText);
            comicItem.appendChild(comicLink);
            comicGrid.appendChild(comicItem);
        });
        searchResultsList.appendChild(comicGrid);
    }
});
