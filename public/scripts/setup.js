(function() {
    var Setup = function() {
        this.$el = $('.setup');

        this.bindEvents();
    };
    
    Setup.prototype = {
        $el: null,
        gameList: null,
        game: null,
        hostId: null,

        constructor: Setup,
        bindEvents: function() {
            this.$el.find('.section-start').on('click', '.join', this.onJoin.bind(this));
            this.$el.find('.section-start').on('click', '.host', this.onHost.bind(this));

            this.$el.find('.section-join .game-list').on('click', '.connect', this.onConnect.bind(this));
            this.$el.find('.section-join .game-list').on('click', '.refresh', this.onRefresh.bind(this));
            
            this.$el.find('.section-id-input').on('click', '.start-game', this.onStartGame.bind(this));
        },
        refreshGameList: function() {
            $.ajax({
                url: '/game',
                method: 'GET',
                dataType: 'json'
            }).done(function(gameList) {
                this.setGameList(gameList);
            }.bind(this));
        },
        requestToJoinGame: function(hostId, playerId) {
            $.ajax({
                url: '/game',
                method: 'POST',
                dataType: 'json',
                data: { action: 'JOIN', hostId: hostId, playerId: playerId }
            }).done(function(response) {
                this.setGameList(response.gameList);
                this.joinGame(playerId, hostId);
            }.bind(this)).fail(function(response) {
                response = JSON.parse(response.responseText);
                this.setGameList(response.gameList);
                alert(response.message);
            }.bind(this));
        },
        requestToHostGame: function(playerId) {
            $.ajax({
                url: '/game',
                method: 'POST',
                dataType: 'json',
                data: { action: 'HOST', hostId: playerId }
            }).done(function(response) {
                this.setGameList(response.gameList);
                this.hostGame(playerId);
            }.bind(this)).fail(function(response) {
                response = JSON.parse(response.responseText);
                this.setGameList(response.gameList);
                alert(response.message);
            }.bind(this));
        },
        joinGame: function(playerId, opponentId) {
            this.hide();
            
            var controller = new Controller();
            var player = new Player(playerId, controller);
            var opponent = new Player(opponentId, null);
            this.game = new Game(player, opponent);
        },
        hostGame: function(playerId) {
            this.hide();
            
            var controller = new Controller();
            var player = new Player(playerId, controller);
            this.game = new Game(player, null);
        },
        show: function() {
            this.$el.show();
        },
        hide: function() {
            this.$el.hide();
        },
        showIdInput: function() {
            this.$el.find('.section-id-input').fadeIn();
        },
        hideInInput: function() {
            this.$el.find('.section-id-input').fadeOut();
        },
        

        // Getters and Setters
        getGameList: function() {
            return this.gameList;
        },
        setGameList: function(gameList) {
            this.gameList = gameList;

            this.$el.find('.section-join .game-list tbody').empty();

            for(var i = 0; i < gameList.sessions.length; i++) {
                if(gameList.sessions[i].opponent == null) {
                    this.$el.find('.section-join .game-list tbody').append(
                        '<tr><td class=\'hostId\'>' + 
                        gameList.sessions[i].host.id + 
                        '</td><td class=\'connect\'>Connect</td></tr>'
                    );
                }
            }
        },
        
        // Events
        onJoin: function() {
            this.$el.find('.section-start').fadeOut();
            this.$el.find('.section-join').fadeIn();

            this.refreshGameList();
        },
        onHost: function() {
            this.$el.find('.section-start').fadeOut();
            this.showIdInput();
        },
        onConnect: function(e) {
            this.hostId = $(e.target).parent().find('.hostId').text();
            this.$el.find('.section-join').fadeOut();
            this.showIdInput();
        },
        onRefresh: function() {
            this.refreshGameList();
        },
        onStartGame: function() {
            var playerId = this.$el.find('.section-id-input .id-input').val();
            
            if(this.hostId) {
                this.requestToJoinGame(this.hostId, playerId);
            } else {
                // Player is host
                this.requestToHostGame(playerId);
            }
        }
    };

    new Setup();
})();