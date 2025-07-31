document.addEventListener('DOMContentLoaded', () => {
    const comicDetailName = document.getElementById('comic-detail-name');
    const comicThumb = document.getElementById('comic-thumb');
    const comicOriginName = document.getElementById('comic-origin-name');
    const comicAuthor = document.getElementById('comic-author');
    const comicStatus = document.getElementById('comic-status');
    const comicCategories = document.getElementById('comic-categories');
    const comicUpdatedAt = document.getElementById('comic-updated-at');
    const comicContent = document.getElementById('comic-content');
    const chaptersList = document.getElementById('chapters');
    const comicTitleHead = document.getElementById('comic-title-head');
    const sortNewestBtn = document.getElementById('sort-newest');
    const sortOldestBtn = document.getElementById('sort-oldest');

    const CDN_IMAGE_DOMAIN = 'https://img.otruyenapi.com';

    const urlParams = new URLSearchParams(window.location.search);
    const comicSlug = urlParams.get('slug');

    let allChaptersData = []; // Lưu trữ dữ liệu chương gốc
    let currentSortOrder = 'desc'; // Mặc định sắp xếp mới nhất (descending)

    if (comicSlug) {
        fetchComicDetail(comicSlug);
    } else {
        comicDetailName.textContent = 'Không tìm thấy truyện.';
    }

    async function fetchComicDetail(slug) {
        try {
            const API_DETAIL = `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`;
            const response = await fetch(API_DETAIL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Lưu trữ toàn bộ dữ liệu chương
            allChaptersData = data.data.item.chapters.flatMap(server => server.server_data);
            displayComicDetail(data.data.item);
            sortChapters('desc'); // Mặc định hiển thị mới nhất
        } catch (error) {
            console.error('Error fetching comic detail:', error);
            comicDetailName.textContent = 'Không thể tải chi tiết truyện. Vui lòng thử lại sau.';
        }
    }

    function displayComicDetail(comic) {
        comicTitleHead.textContent = `${comic.name} - Chi Tiết Truyện`;
        comicDetailName.textContent = comic.name;
        comicThumb.src = `${CDN_IMAGE_DOMAIN}/uploads/comics/${comic.thumb_url}`;
        comicThumb.alt = comic.name;
        comicThumb.loading = "lazy"; // Thêm lazy loading
        comicOriginName.textContent = comic.origin_name.join(', ') || 'N/A';
        comicAuthor.textContent = comic.author.join(', ') || 'N/A';
        comicStatus.textContent = comic.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành';
        comicCategories.textContent = comic.category.map(cat => cat.name).join(', ');

        const updatedAtDate = new Date(comic.updatedAt);
        comicUpdatedAt.textContent = updatedAtDate.toLocaleString('vi-VN');

        const parser = new DOMParser();
        const doc = parser.parseFromString(comic.content, 'text/html');
        comicContent.textContent = doc.body.textContent || comic.content;
    }

    function sortChapters(order) {
        currentSortOrder = order;
        let sortedChapters = [...allChaptersData]; // Tạo bản sao để sắp xếp

        sortedChapters.sort((a, b) => {
            const chapterA = parseFloat(a.chapter_name);
            const chapterB = parseFloat(b.chapter_name);
            if (order === 'desc') {
                return chapterB - chapterA; // Mới nhất đến cũ nhất
            } else {
                return chapterA - chapterB; // Cũ nhất đến mới nhất
            }
        });
        renderChapters(sortedChapters);
        updateSortButtonStates();
    }

    function renderChapters(chaptersToRender) {
        chaptersList.innerHTML = ''; // Clear previous chapters

        if (!chaptersToRender || chaptersToRender.length === 0) {
            chaptersList.innerHTML = '<li>Chưa có chương nào được cập nhật.</li>';
            return;
        }

        chaptersToRender.forEach(chapter => {
            const listItem = document.createElement('li');
            const chapterLink = document.createElement('a');
            chapterLink.href = `chapter-reader.html?chapterApi=${encodeURIComponent(chapter.chapter_api_data)}&comicSlug=${comicSlug}&comicName=${encodeURIComponent(comicDetailName.textContent)}&chapterName=${encodeURIComponent(chapter.chapter_name)}`;
            chapterLink.textContent = `Chương ${chapter.chapter_name} ${chapter.chapter_title ? `- ${chapter.chapter_title}` : ''}`;
            listItem.appendChild(chapterLink);
            chaptersList.appendChild(listItem);
        });
    }

    function updateSortButtonStates() {
        if (currentSortOrder === 'desc') {
            sortNewestBtn.classList.add('active');
            sortOldestBtn.classList.remove('active');
        } else {
            sortOldestBtn.classList.add('active');
            sortNewestBtn.classList.remove('active');
        }
    }

    sortNewestBtn.addEventListener('click', () => sortChapters('desc'));
    sortOldestBtn.addEventListener('click', () => sortChapters('asc'));
});
