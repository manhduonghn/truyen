document.addEventListener('DOMContentLoaded', () => {
    const comicListElement = document.getElementById('comic-list');
    const API_HOME = 'https://otruyenapi.com/v1/api/home';
    const CDN_IMAGE_DOMAIN = 'https://img.otruyenapi.com';

    async function fetchComics() {
        try {
            const response = await fetch(API_HOME);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayComics(data.data.items);
        } catch (error) {
            console.error('Error fetching comics:', error);
            comicListElement.innerHTML = '<p class="error">Không thể tải truyện. Vui lòng thử lại sau.</p>';
        }
    }

    function displayComics(comics) {
        comicListElement.innerHTML = ''; // Clear loading message
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
            if (comic.chaptersLatest && comic.chaptersLatest.length > 0) {
                latestChapter.textContent = `Chapter: ${comic.chaptersLatest[0].chapter_name}`;
            } else {
                latestChapter.textContent = 'Chưa có chương nào';
            }
            
            comicInfoText.appendChild(name);
            comicInfoText.appendChild(latestChapter);

            comicLink.appendChild(imageWrapper);
            comicLink.appendChild(comicInfoText);
            comicItem.appendChild(comicLink);
            comicListElement.appendChild(comicItem);
        });
    }

    fetchComics();
});
