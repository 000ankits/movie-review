const comText = document.querySelector('#commentText');
const comSubBtn = document.querySelector('#submitComment');
const comCancBtn = document.querySelector('#cancelComment');
const comCreateBtn = document.querySelector('#createComment');

function commentCreate() {
	comText.value = '';
	comText.style.display = 'block';
	comSubBtn.style.display = 'block';
	comCancBtn.style.display = 'block';
	comCreateBtn.style.display = 'none';
}

function cancelComment() {
	comText.value = '';
	comText.style.display = 'none';
	comSubBtn.style.display = 'none';
	comCancBtn.style.display = 'none';
	comCreateBtn.style.display = 'block';
}

function submitComment() {
	comText.style.display = 'none';
	comSubBtn.style.display = 'none';
	comCancBtn.style.display = 'none';
	comCreateBtn.style.display = 'block';
	document.querySelector('#commentForm').submit();
}
