var pageNo = 1,
    pageSize = 3,
    tbody = $('tbody'),
    selectOption = $('#search-title'),
    prevPageLi = $('#prevPage'),
    nextPageLi = $('#nextPage'),
    currSpan = $('#currPage > span'),
    templateSrcforTourList = $('#tr-template-selectOption').html(),
    templateSrc = $('#tr-template').html(); // script 태그에서 템플릿 데이터를 꺼낸다.
var search = '';
var tourNo = 0;
var tourDate = 0;

var datePickerOption = {
    i18n : {
      months : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      weekdaysFull: ['일', '월', '화', '수', '목', '금', '토'],
      weekdaysShort:['일', '월', '화', '수', '목', '금', '토'],
      cancel:'취소',
      done: '확인'
},
    format : 'yyyy년 mm월 dd일',
    autoClose: true
}


//Handlebars를 통해 템플릿 데이터를 가지고 최종 결과를 생성할 함수를 준비한다.
var trGeneratorForTourList = Handlebars.compile(templateSrcforTourList);
    trGenerator = Handlebars.compile(templateSrc);

$(document).ready(function(){
  $('.datepicker').datepicker(datePickerOption);
  $('.modal').modal();
});

// JSON 형식의 데이터 목록 가져오기
function loadList(pn, search, tourNo, tourDate) {
  
  $.getJSON('../../app/json/reservation/list?pageNo=' + pn + '&pageSize=' + pageSize + '&search=' +search + '&tourNo=' + tourNo + '&tourDate=' + tourDate, 
    function(obj) {
      // 서버에 받은 데이터 중에서 페이지 번호를 글로벌 변수에 저장한다.
      pageNo = obj.pageNo;
      
      // TR 태그를 생성하여 테이블 데이터를 갱신한다.
      tbody.html(''); // 이전에 출력한 내용을 제거한다.
      
      // 템플릿 엔진을 실행하여 tr 태그 목록을 생성한다. 그리고 바로 tbody에 붙인다.
      $(trGenerator(obj)).appendTo(tbody);
      
      for(requirement of $('.requirement')) {
        $.ajaxSetup({async:false});
        if($(requirement).attr('data-content').length > 0) {
         $(requirement).append('<i class="tiny material-icons requirement-checked modal-trigger" href="#modal1">check</i>');
       }
        $.ajaxSetup({async:true});
      }
      
      // 현재 페이지의 번호를 갱신한다.
      currSpan.html(String(pageNo));
      
      // 1페이지일 경우 버튼을 비활성화 한다.
      if (pageNo == 1) {
        prevPageLi.addClass('disabled');
      } else {
        prevPageLi.removeClass('disabled');
      } 
        
      // 마지막 페이지일 경우 버튼을 비활성화 한다.
      if (pageNo == obj.totalPage) {
       // console.log(obj.totalPage);
        nextPageLi.addClass('disabled');
      } else {
     //   console.log(obj.totalPage);
        nextPageLi.removeClass('disabled');
      }
      
      // 데이터 로딩이 완료되면 body 태그에 이벤트를 전송한다.
      $(document.body).trigger('loaded-list');
      
    }); // Bitcamp.getJSON()
  
} // loadList()


function loadTourList() {
  $.getJSON('../../app/json/reservation/tourlist', 
    function(data) {
    $(trGeneratorForTourList(data)).appendTo(selectOption);
    $('#search-title').prepend('<option data-no="0" selected>전체 상품</option>');
  });
}

$('#prevPage > a').click((e) => {
  e.preventDefault();
  loadList(pageNo - 1, search, tourNo, tourDate);
});

$('#nextPage > a').click((e) => {
  e.preventDefault();
  loadList(pageNo + 1, search, tourNo, tourDate);
});


//페이지를 출력한 후 1페이지 목록을 로딩한다.
loadList(1, search, tourNo, tourDate);
loadTourList();

// 테이블 목록 가져오기를 완료했으면 제목 a 태그에 클릭 리스너를 등록한다. 
$(document.body).bind('loaded-list', () => {
  // 제목을 클릭했을 때 view.html로 전환시키기
  $('.bit-view-link').click((e) => {
    e.preventDefault();
    window.location.href = 'view.html?no=' + 
      $(e.target).attr('data-no');
  });
});


$(document.body).bind('loaded-list', () => {
  // 제목을 클릭했을 때 view.html로 전환시키기
  $('.requirement-checked').click((e) => {
    e.preventDefault();
    var requirement = $(e.target).parents('th').attr('data-content');
    $('.requirement-text').html(requirement);
  });
});


$('#search-btn').click((e) => {
  e.preventDefault();
  search = $('#search-box').val();
  loadList(1, search, tourNo, tourDate);
});

$('#search-title').change((e) => {
  tourNo = $('#search-title option:selected').attr('data-no');
  console.log(tourNo);
  loadList(1, search, tourNo, tourDate);
});

$('#search-date').change((e) => {
  console.log($('#search-date').val());
//  var year = $('#search-date').val().substring(0,4);
//  var month = $('#search-date').val().substring(6,8);
//  var day = $('#search-date').val().substring(10,12);
//  tourDate = year+ '-' + month + '-' + (++day);
//  var tourDate = ($('#search-date').val().replace(/[^0-9]/g,""));
  if($('#search-date').val()) {
    tourDate = ($('#search-date').val().replace(/[^0-9]/g,""));
    console.log(tourDate);  
    loadList(1, search, tourNo, tourDate);
  }
});
//console.log($('#search-date').val());
//console.log(typeof($('#search-date').val()));


