document.addEventListener('DOMContentLoaded', () => {
    const chapterImagesContainer = document.getElementById('chapter-images');
    const chapterReaderTitle = document.getElementById('chapter-reader-title');
    const chapterTitleHead = document.getElementById('chapter-title-head');
    const backToDetailButton = document.getElementById('back-to-detail');

    const urlParams = new URLSearchParams(window.location.search);
    const chapterApiUrl = urlParams.get('chapterApi');
    const comicSlug = urlParams.get('comicSlug');
    const comicName = urlParams.get('comicName');
    const chapterName = urlParams.get('chapterName');

    if (chapterApiUrl) {
        fetchChapterImages(chapterApiUrl);
        chapterReaderTitle.textContent = `${comicName} - Chương ${chapterName}`;
        chapterTitleHead.textContent = `Chương ${chapterName} - ${comicName}`;
        backToDetailButton.href = `comic-detail.html?slug=${comicSlug}`;
    } else {
        chapterImagesContainer.innerHTML = '<p class="error">Không tìm thấy chương truyện.</p>';
    }

    async function fetchChapterImages(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayChapterImages(data.data.domain_cdn, data.data.item.chapter_path, data.data.item.chapter_image);
        } catch (error) {
            console.error('Error fetching chapter images:', error);
            chapterImagesContainer.innerHTML = '<p class="error">Không thể tải chương truyện. Vui lòng thử lại sau.</p>';
        }
    }

    function displayChapterImages(cdnDomain, chapterPath, images) {
        chapterImagesContainer.innerHTML = ''; // Clear loading message

        if (!images || images.length === 0) {
            chapterImagesContainer.innerHTML = '<p class="error">Chương này chưa có hình ảnh.</p>';
            return;
        }

        images.forEach(image => {
            const img = document.createElement('img');
            img.src = `${cdnDomain}/${chapterPath}/${image.image_file}`;
            img.alt = `Trang ${image.image_page + 1}`;
            chapterImagesContainer.appendChild(img);
        });
    }
});
