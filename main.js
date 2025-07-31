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
            img.loading = "lazy"; // Thêm lazy loading
            imageWrapper.appendChild(img);

            // Tạo wrapper cho thông tin text
            const comicInfoText = document.createElement('div');
            comicInfoText.classList.add('comic-info-text');

            const name = document.createElement('h3');
            name.textContent = comic.name;
            comicInfoText.appendChild(name);

            // Bổ sung thông tin Tên gốc, Tác giả, Chương mới nhất
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

            // Chương mới nhất
            const latestChapter = document.createElement('p');
            if (comic.chaptersLatest && comic.chaptersLatest.length > 0) {
                latestChapter.textContent = `Chương: ${comic.chaptersLatest[0].chapter_name}`;
            } else {
                latestChapter.textContent = 'Chưa có chương'; // Hoặc bỏ qua nếu bạn muốn ẩn hoàn toàn
            }
            comicDetailsInfo.appendChild(latestChapter);
            
            comicInfoText.appendChild(comicDetailsInfo);

            comicLink.appendChild(imageWrapper);
            comicLink.appendChild(comicInfoText);
            comicItem.appendChild(comicLink);
            comicListElement.appendChild(comicItem);
        });
    }

    fetchComics();
});
