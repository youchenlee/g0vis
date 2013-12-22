// Generated by LiveScript 1.2.0
var mainCtrl, ircCtrl, ircCountCtrl, ircCalendarCtrl;
mainCtrl = function($scope, $http){
  return import$($scope, {
    tabs: [['about', '關於'], ['timeline', '時間軸'], ['project', '專案'], ['irc', '聊天室']],
    tab: 'irc',
    tabClass: function(it){
      if ($scope.tab === it) {
        return 'active';
      } else {
        return "";
      }
    },
    setTab: function(it){
      return $scope.tab = it;
    }
  });
};
ircCtrl = function($scope, $http, $element){
  import$($scope, {
    panel: 1,
    setPanel: function(d){
      return $scope.panel = ($scope.panel + d + 2) % 2;
    },
    color: d3.scale.category20()
  });
  return $http.get('g0v-count.json').success(function(data){
    $scope.$broadcast('data.ready', data);
    return console.log(data);
  });
};
ircCountCtrl = function($scope, $element){
  import$($scope, {
    cur: {
      x: 0,
      y: 0,
      name: "1",
      value: "1"
    },
    hover: function(e, n){
      var ref$, w, h, dx, tx, ty, lx1, ly1, lx2, ly2;
      ref$ = [$element.width(), $element.height()], w = ref$[0], h = ref$[1];
      dx = n.name.length * 2;
      ref$ = [
        e.clientX < w / 2
          ? 10
          : 266 - 40, e.clientY / h * 200 * 0.8 + 20
      ], tx = ref$[0], ty = ref$[1];
      ref$ = [
        n.x + 20 + (e.clientX < w / 2
          ? -n.r / 1.5
          : n.r / 1.5), n.y
      ], lx1 = ref$[0], ly1 = ref$[1];
      ref$ = [
        e.clientX < w / 2
          ? 10 + dx
          : 266 - 40 - dx, e.clientY / h * 200 * 0.8 + 20
      ], lx2 = ref$[0], ly2 = ref$[1];
      import$($scope.cur, n);
      return ref$ = $scope.cur, ref$.tx = tx, ref$.ty = ty, ref$.lx1 = lx1, ref$.ly1 = ly1, ref$.lx2 = lx2, ref$.ly2 = ly2, ref$;
    }
  });
  return $scope.$on('data.ready', function(e, data){
    var bubble;
    bubble = d3.layout.pack().sort(null).size([266 * 0.8, 200 * 0.8]).padding(1.5);
    $scope.nick = bubble.nodes({
      children: data.by_nick.map(function(it){
        return {
          name: it[0],
          value: it[1]
        };
      })
    }).filter(function(it){
      return !it.children;
    });
    return $scope.sum = $scope.nick.reduce(function(){
      return arguments[0] + arguments[1].value;
    }, 0);
  });
};
ircCalendarCtrl = function($scope, $element){
  import$($scope, {
    lineChart: "M0,0",
    th: ['一', '二', '三', '四', '五', '六', '日'],
    event: {
      "2013-06-08": "hackath3n 客廳工廠黑客松",
      "2013-08-10": "hackath4n 國民大會黑客松",
      "2013-10-20": "hackath5n 美麗島黑客松",
      "2013-11-02": "Yahoo!Hack TW 2013",
      "2013-11-03": "Yahoo!Hack TW 2013",
      "2013-11-24": "第一次萌典松與啄木鳥頒獎",
      "2013-12-21": "hackath6n 勞動基準黑客松"
    },
    yHash: {},
    mHash: {},
    hover: {
      map: d3.scale.linear().domain([0, 300]).range([50, 250]),
      cur: {
        v: 0,
        d: "-"
      },
      setter: null,
      loc: function(e){
        var n, w, i;
        n = $(e.currentTarget);
        w = 1440 * e.currentTarget.getBBox().width / 300.0;
        i = parseInt(300 * (e.clientX - n.offset().left) / w);
        return this.set($scope.date[i]);
      },
      set: function(it){
        var this$ = this;
        if (!it) {
          this.setter = setTimeout(function(){
            this$.setter = null;
            return $scope.$apply(function(){
              return this$.cur = {
                v: 0,
                d: "-"
              };
            });
          }, 1000);
        } else if (this.setter) {
          clearTimeout(this.setter);
          this.setter = null;
        }
        import$(this.cur, it);
        this.cur.event = $scope.event[this.cur.d] || "　";
        return this.cur.tx = this.map(this.cur.x);
      }
    }
  });
  return $scope.$on('data.ready', function(e, data){
    var len, weekday, offset, dmonth, v, ref$, min, max, xMap, yMap;
    len = data.by_date_per_day.length;
    weekday = data.by_date_per_day.slice(len - 259, len - 1);
    offset = (moment(weekday[0][0]).weekday() + 6) % 7;
    dmonth = 0;
    $scope.date = weekday.map(function(d, i){
      var m, ref$, year, month, x, y;
      i += offset;
      m = moment(d[0]);
      ref$ = [m.year(), m.month() + 1], year = ref$[0], month = ref$[1];
      if (!(month in $scope.mHash)) {
        dmonth += 2;
        $scope.mHash[month] = dmonth + parseInt((i % 280) / 7) * 7;
      }
      ref$ = [dmonth + parseInt((i % 280) / 7) * 7, (i % 7) * 7 + parseInt(i / 280) * 60], x = ref$[0], y = ref$[1];
      if (!(year in $scope.yHash)) {
        $scope.yHash[year] = x;
      }
      return {
        y: y,
        x: x,
        v: d[1],
        d: d[0]
      };
    });
    v = $scope.date.map(function(it){
      return it.v;
    });
    ref$ = [d3.min(v), d3.max(v)], min = ref$[0], max = ref$[1];
    $scope.dayFrom = moment($scope.date[0].d).format('L');
    $scope.dayTil = moment((ref$ = $scope.date)[ref$.length - 1].d).format('L');
    $scope.heatColor = d3.scale.linear().domain([min, (2 * min + max) / 3, (min + 2 * max) / 3, max]).range(['#EEEEEE', '#D6E685', '#8CC665', '#1E6823']);
    xMap = d3.scale.linear().domain([0, $scope.date.length]).range([2, 282]);
    yMap = d3.scale.linear().domain([min, max]).range([20, 0]);
    $scope.line = d3.svg.line().x(function(){
      return xMap(arguments[1]);
    }).y(function(it){
      return yMap(it.v);
    }).interpolate('line').tension(1.0);
    $scope.lineChart = $scope.line($scope.date);
    return $scope.date.map(function(d, i){
      d.lx = xMap(i);
      return d.ly = yMap(d.v);
    });
  });
};
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}