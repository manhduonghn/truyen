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
        searchInputField.value = keyword;
        fetchSearchResults(keyword);
    } else {
        searchResultsTitle.textContent = 'Vui lòng nhập từ khóa để tìm kiếm.';
        searchResultsList.innerHTML = '';
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
        searchResultsList.innerHTML = '';

        if (!comics || comics.length === 0) {
            searchResultsList.innerHTML = '<p class="no-results">Không tìm thấy truyện nào phù hợp.</p>';
            return;
        }

        const comicGrid = document.createElement('div');
        comicGrid.classList.add('comic-list');

        comics.forEach(comic => {
            const comicItem = document.createElement('div');
            comicItem.classList.add('comic-item');

            const comicLink = document.createElement('a');
            comicLink.href = `comic-detail.html?slug=${comic.slug}`;

            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add('image-wrapper');
            const img = document.createElement('img');
            img.src = `${CDN_IMAGE_DOMAIN}/uploads/comics/${comic.thumb_url}`;
            img.alt = comic.name;
            img.loading = "lazy";
            imageWrapper.appendChild(img);

            const comicInfoText = document.createElement('div');
            comicInfoText.classList.add('comic-info-text');

            const name = document.createElement('h3');
            name.textContent = comic.name;
            comicInfoText.appendChild(name);

            // Bổ sung thông tin Tên gốc, Tác giả
            const comicDetailsInfo = document.createElement('div');
            comicDetailsInfo.classList.add('comic-details-info');

            // Tên gốc
            if (comic.origin_name && comic.origin_name.length > 0 && comic.origin_name[0] !== "") {
                const originName = document.createElement('p');
                originName.textContent = `Tên gốc: ${comic.origin_name.join(', ')}`;
                comicDetailsInfo.appendChild(originName);
            }

            // Tác giả (Kiểm tra nếu có và không rỗng)
            if (comic.author && comic.author.length > 0 && comic.author[0] !== "") {
                const author = document.createElement('p');
                author.textContent = `Tác giả: ${comic.author.join(', ')}`;
                comicDetailsInfo.appendChild(author);
            }

            // KHÔNG hiển thị "Chương đang cập nhật" cho trang search
            // const latestChapter = document.createElement('p');
            // latestChapter.textContent = 'Chương: Đang cập nhật'; 
            // latestChapter.style.fontStyle = 'italic';
            // latestChapter.style.color = '#999';
            // comicInfoText.appendChild(latestChapter);
            
            comicInfoText.appendChild(comicDetailsInfo); // Thêm div chứa thông tin chi tiết vào comicInfoText

            comicLink.appendChild(imageWrapper);
            comicLink.appendChild(comicInfoText);
            comicItem.appendChild(comicLink);
            comicGrid.appendChild(comicItem);
        });
        searchResultsList.appendChild(comicGrid);
    }
});
