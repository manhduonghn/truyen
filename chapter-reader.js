document.addEventListener('DOMContentLoaded', () => {
    const chapterImagesContainer = document.getElementById('chapter-images');
    const chapterReaderTitle = document.getElementById('chapter-reader-title');
    const chapterTitleHead = document.getElementById('chapter-title-head');
    const backToDetailButton = document.getElementById('back-to-detail');
    // Đã loại bỏ prevChapterTopBtn và nextChapterTopBtn
    const prevChapterBottomBtn = document.getElementById('prev-chapter-bottom');
    const nextChapterBottomBtn = document.getElementById('next-chapter-bottom');

    const urlParams = new URLSearchParams(window.location.search);
    const chapterApiUrl = urlParams.get('chapterApi');
    const comicSlug = urlParams.get('comicSlug');
    const comicName = urlParams.get('comicName');
    let currentChapterName = urlParams.get('chapterName');

    let comicChapters = [];
    let currentChapterIndex = -1;

    if (chapterApiUrl) {
        chapterReaderTitle.textContent = `${comicName} - Chương ${currentChapterName}`;
        chapterTitleHead.textContent = `Chương ${currentChapterName} - ${comicName}`;
        backToDetailButton.href = `comic-detail.html?slug=${comicSlug}`;
        
        fetchComicDetailsForNavigation(comicSlug);
        fetchChapterImages(chapterApiUrl);
    } else {
        chapterImagesContainer.innerHTML = '<p class="error">Không tìm thấy chương truyện.</p>';
    }

    async function fetchComicDetailsForNavigation(slug) {
        try {
            const API_DETAIL = `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`;
            const response = await fetch(API_DETAIL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Lấy tất cả các chương và sắp xếp theo số chương (tăng dần)
            comicChapters = data.data.item.chapters.flatMap(server => server.server_data);
            comicChapters.sort((a, b) => parseFloat(a.chapter_name) - parseFloat(b.chapter_name));

            // Tìm vị trí của chương hiện tại
            currentChapterIndex = comicChapters.findIndex(ch => ch.chapter_name === currentChapterName);
            updateNavigationButtons();
        } catch (error) {
            console.error('Error fetching comic details for navigation:', error);
        }
    }

    async function fetchChapterImages(apiUrl) {
        chapterImagesContainer.innerHTML = '<p class="loading">Đang tải chương truyện...</p>';
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
        chapterImagesContainer.innerHTML = '';

        if (!images || images.length === 0) {
            chapterImagesContainer.innerHTML = '<p class="error">Chương này chưa có hình ảnh.</p>';
            return;
        }

        images.forEach(image => {
            const img = document.createElement('img');
            img.src = `${cdnDomain}/${chapterPath}/${image.image_file}`;
            img.alt = `Trang ${image.image_page + 1}`;
            img.loading = "lazy";
            chapterImagesContainer.appendChild(img);
        });
    }

    function updateNavigationButtons() {
        // Chỉ cập nhật trạng thái cho các nút ở dưới cùng
        prevChapterBottomBtn.disabled = (currentChapterIndex <= 0);
        nextChapterBottomBtn.disabled = (currentChapterIndex >= comicChapters.length - 1);
    }

    function goToChapter(offset) {
        const newIndex = currentChapterIndex + offset;
        if (newIndex >= 0 && newIndex < comicChapters.length) {
            const nextChapter = comicChapters[newIndex];
            const newChapterApiUrl = nextChapter.chapter_api_data;
            const newChapterName = nextChapter.chapter_name;

            // Cập nhật URL trình duyệt
            const newUrl = `chapter-reader.html?chapterApi=${encodeURIComponent(newChapterApiUrl)}&comicSlug=${comicSlug}&comicName=${encodeURIComponent(comicName)}&chapterName=${encodeURIComponent(newChapterName)}`;
            window.history.pushState({ path: newUrl }, '', newUrl);

            // Cập nhật biến trạng thái
            currentChapterIndex = newIndex;
            currentChapterName = newChapterName;

            // Cập nhật tiêu đề và tải chương mới
            chapterReaderTitle.textContent = `${comicName} - Chương ${newChapterName}`;
            chapterTitleHead.textContent = `Chương ${newChapterName} - ${comicName}`;
            fetchChapterImages(newChapterApiUrl);
            updateNavigationButtons();
            window.scrollTo(0, 0); // Cuộn lên đầu trang sau khi chuyển chương
        }
    }

    // Chỉ lắng nghe sự kiện cho các nút ở dưới cùng
    prevChapterBottomBtn.addEventListener('click', () => goToChapter(-1));
    nextChapterBottomBtn.addEventListener('click', () => goToChapter(1));
});
