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

    const CDN_IMAGE_DOMAIN = 'https://img.otruyenapi.com';

    const urlParams = new URLSearchParams(window.location.search);
    const comicSlug = urlParams.get('slug');

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
            displayComicDetail(data.data.item);
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
        comicOriginName.textContent = comic.origin_name.join(', ') || 'N/A';
        comicAuthor.textContent = comic.author.join(', ') || 'N/A';
        comicStatus.textContent = comic.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành';
        comicCategories.textContent = comic.category.map(cat => cat.name).join(', ');

        const updatedAtDate = new Date(comic.updatedAt);
        comicUpdatedAt.textContent = updatedAtDate.toLocaleString('vi-VN');

        // Remove HTML tags from content using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(comic.content, 'text/html');
        comicContent.textContent = doc.body.textContent || comic.content;

        chaptersList.innerHTML = ''; // Clear any loading message
        if (comic.chapters && comic.chapters.length > 0) {
            // Flatten chapters and sort them in descending order by chapter_name (numeric)
            const allChapters = comic.chapters.flatMap(server => server.server_data);
            allChapters.sort((a, b) => {
                const chapterA = parseFloat(a.chapter_name);
                const chapterB = parseFloat(b.chapter_name);
                return chapterB - chapterA; // Sort descending
            });

            allChapters.forEach(chapter => {
                const listItem = document.createElement('li');
                const chapterLink = document.createElement('a');
                chapterLink.href = `chapter-reader.html?chapterApi=${encodeURIComponent(chapter.chapter_api_data)}&comicSlug=${comicSlug}&comicName=${encodeURIComponent(comic.name)}&chapterName=${encodeURIComponent(chapter.chapter_name)}`;
                chapterLink.textContent = `Chương ${chapter.chapter_name} ${chapter.chapter_title ? `- ${chapter.chapter_title}` : ''}`;
                listItem.appendChild(chapterLink);
                chaptersList.appendChild(listItem);
            });
        } else {
            chaptersList.innerHTML = '<li>Chưa có chương nào được cập nhật.</li>';
        }

        // Set back button link
        const backButton = document.getElementById('back-to-detail');
        if (backButton) {
            backButton.href = `index.html`; // Go back to home page
        }
    }
});
